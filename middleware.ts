import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// URLs de los microfrontends
const MICROFRONTEND_SIMULATOR_URL =
  process.env.NEXT_PUBLIC_MICROFRONTEND_SIMULATOR_URL ||
  'https://simulador-ahorro-front.vercel.app';
const MICROFRONTEND_ONBOARDING_URL =
  process.env.NEXT_PUBLIC_MICROFRONTEND_ONBOARDING_URL ||
  'https://simulador-ahorro-front.vercel.app';
const MICROFRONTEND_AUTHOR_URL =
  process.env.NEXT_PUBLIC_MICROFRONTEND_AUTHOR_URL ||
  'https://elizabeth-velasquez.vercel.app';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log(`[Middleware] Processing: ${pathname}, referer: ${request.headers.get('referer') || 'none'}`);

  // PRIORIDAD 1: Si es /author o /author/*, procesarlo directamente
  if (pathname === '/author' || pathname.startsWith('/author/')) {
    console.log(`[Middleware] Processing /author route: ${pathname}`);
    const microfrontendBaseUrl = MICROFRONTEND_AUTHOR_URL;
    // Para /author, siempre ir a la raíz del microfrontend (/)
    // Para /author/algo, ir a /algo del microfrontend
    let microfrontendPath: string;
    if (pathname === '/author') {
      microfrontendPath = '/';
    } else {
      microfrontendPath = pathname.replace('/author', '');
    }
    const microfrontendUrl = new URL(microfrontendPath, microfrontendBaseUrl);
    
    request.nextUrl.searchParams.forEach((value: string, key: string) => {
      microfrontendUrl.searchParams.set(key, value);
    });

    console.log(`[Middleware] Fetching AUTHOR: ${microfrontendUrl.toString()}`);

    try {
      // Agregar timeout para evitar que el fetch se quede colgado
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
      
      const response = await fetch(microfrontendUrl.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': request.headers.get('user-agent') || '',
          'Accept': request.headers.get('accept') || 'text/html',
          'Accept-Language': request.headers.get('accept-language') || 'es',
        },
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        let html = await response.text();
        const baseUrl = microfrontendBaseUrl.replace(/\/$/, '');
        
        // Si estamos en /author, necesitamos reescribir las referencias a la URL en el JavaScript
        // para que Next.js piense que está en / en lugar de /author
        if (pathname === '/author') {
          // Reescribir urlParts para que apunte a la raíz
          html = html.replace(/"urlParts":\["","[^"]*"\]/g, '"urlParts":["",""]');
          // Reescribir initialTree para que apunte a la raíz en lugar de /_not-found
          html = html.replace(/"initialTree":\["",\{"children":\["\/_not-found"/g, '"initialTree":["",{"children":["__PAGE__"');
          html = html.replace(/"initialTree":\["",\{"children":\["\/author"/g, '"initialTree":["",{"children":["__PAGE__"');
        }
        
        // Reescribir URLs (usar función helper de abajo)
        html = html.replace(/\s(href|src)=["']([^"']+)["']/gi, (match, attr, url) => {
          if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:') || url.startsWith('#')) {
            return match;
          }
          if (url.startsWith('/')) {
            return ` ${attr}="${baseUrl}${url}"`;
          }
          return match;
        });
        
        html = html.replace(/srcset=["']([^"']+)["']/gi, (match, srcset) => {
          const rewritten = srcset.split(',').map((item: string) => {
            const parts = item.trim().split(/\s+/);
            const url = parts[0];
            const descriptor = parts.slice(1).join(' ');
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:')) {
              return item;
            }
            if (url.startsWith('/')) {
              return `${baseUrl}${url}${descriptor ? ' ' + descriptor : ''}`;
            }
            return item;
          }).join(', ');
          return `srcset="${rewritten}"`;
        });

        console.log(`[Middleware] Successfully fetched and processed AUTHOR HTML`);
        return new NextResponse(html, {
          status: response.status,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        });
      } else {
        console.error(`[Middleware] Failed to fetch AUTHOR: ${response.status} ${response.statusText} from ${microfrontendUrl.toString()}`);
        // Si es 404, intentar redirigir al home del microfrontend
        if (response.status === 404 && pathname !== '/author') {
          console.log(`[Middleware] 404 for ${pathname}, trying home instead`);
          const homeUrl = new URL('/', microfrontendBaseUrl);
          try {
            const homeResponse = await fetch(homeUrl.toString(), {
              headers: {
                'User-Agent': request.headers.get('user-agent') || '',
                'Accept': request.headers.get('accept') || 'text/html',
                'Accept-Language': request.headers.get('accept-language') || 'es',
              },
            });
            if (homeResponse.ok) {
              let html = await homeResponse.text();
              const baseUrl = microfrontendBaseUrl.replace(/\/$/, '');
              html = html.replace(/\s(href|src)=["']([^"']+)["']/gi, (match, attr, url) => {
                if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:') || url.startsWith('#')) {
                  return match;
                }
                if (url.startsWith('/')) {
                  return ` ${attr}="${baseUrl}${url}"`;
                }
                return match;
              });
              return new NextResponse(html, {
                status: homeResponse.status,
                headers: {
                  'Content-Type': 'text/html; charset=utf-8',
                  'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                },
              });
            }
          } catch (homeError) {
            console.error('[Middleware] Error fetching home as fallback:', homeError);
          }
        }
      }
    } catch (error: unknown) {
      console.error('[Middleware] Error fetching AUTHOR:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('[Middleware] Fetch timeout for AUTHOR microfrontend');
      }
    }
    
    // Si falla, continuar con el flujo normal (rewrites de next.config.ts)
    // Los rewrites deberían manejar esto automáticamente
    console.log(`[Middleware] Falling back to Next.js rewrites for /author`);
    return NextResponse.next();
  }

  // Si es un recurso estático que viene de /author o /simulator, redirigirlo al microfrontend correspondiente
  // Esto es necesario porque los rewrites genéricos pueden redirigir al microfrontend incorrecto
  const referer = request.headers.get('referer');
  const isFromAuthor = referer?.includes('/author');
  const isFromSimulator = referer?.includes('/simulator');
  
  // Interceptar recursos estáticos de /author
  if (
    (pathname.startsWith('/_next/') ||
     pathname.startsWith('/static/') ||
     pathname.startsWith('/images/') ||
     pathname.startsWith('/img/') ||
     pathname.startsWith('/assets/') ||
     pathname.startsWith('/public/')) &&
    isFromAuthor
  ) {
    // Redirigir recursos estáticos al microfrontend AUTHOR si vienen de /author
    const resourcePath = pathname;
    let authorUrl: string;
    
    // Manejar _next/image especialmente - necesita preservar los query params
    if (pathname === '/_next/image') {
      const searchParams = request.nextUrl.searchParams.toString();
      authorUrl = `${MICROFRONTEND_AUTHOR_URL}${resourcePath}${searchParams ? '?' + searchParams : ''}`;
      console.log(`[Middleware] Redirecting _next/image to AUTHOR: ${authorUrl}`);
    } else {
      authorUrl = `${MICROFRONTEND_AUTHOR_URL}${resourcePath}`;
    }
    
    try {
      const resourceResponse = await fetch(authorUrl, {
        headers: {
          'User-Agent': request.headers.get('user-agent') || '',
          'Accept': request.headers.get('accept') || '*/*',
        },
      });

      if (resourceResponse.ok) {
        const resourceData = await resourceResponse.arrayBuffer();
        return new NextResponse(resourceData, {
          status: resourceResponse.status,
          headers: {
            'Content-Type': resourceResponse.headers.get('content-type') || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } else {
        console.error(`[Middleware] Failed to fetch resource from AUTHOR: ${resourceResponse.status} ${resourceResponse.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching resource from AUTHOR microfrontend:', error);
    }
    
    // Si falla, continuar con el flujo normal
    return NextResponse.next();
  }

  // Interceptar recursos estáticos de /simulator
  // Verificar si es un recurso estático
  const isSimulatorResource = pathname.startsWith('/_next/') ||
     pathname.startsWith('/static/') ||
     pathname.startsWith('/images/') ||
     pathname.startsWith('/img/') ||
     pathname.startsWith('/assets/') ||
     pathname.startsWith('/public/');
  
  // Interceptar recursos estáticos que vienen de /simulator
  // Usar referer para detectar si vienen de /simulator
  if (isSimulatorResource && isFromSimulator) {
    // Redirigir recursos estáticos al microfrontend SIMULATOR si vienen de /simulator
    const resourcePath = pathname;
    let simulatorUrl: string;
    
    // Manejar _next/image especialmente - necesita preservar los query params
    if (pathname === '/_next/image') {
      const searchParams = request.nextUrl.searchParams.toString();
      simulatorUrl = `${MICROFRONTEND_SIMULATOR_URL}${resourcePath}${searchParams ? '?' + searchParams : ''}`;
      console.log(`[Middleware] Redirecting _next/image to SIMULATOR: ${simulatorUrl} (referer: ${referer || 'none'})`);
    } else {
      simulatorUrl = `${MICROFRONTEND_SIMULATOR_URL}${resourcePath}`;
      console.log(`[Middleware] Redirecting resource to SIMULATOR: ${simulatorUrl} (referer: ${referer || 'none'}, pathname: ${pathname})`);
    }
    
    try {
      const resourceResponse = await fetch(simulatorUrl, {
        headers: {
          'User-Agent': request.headers.get('user-agent') || '',
          'Accept': request.headers.get('accept') || '*/*',
        },
      });

      if (resourceResponse.ok) {
        const resourceData = await resourceResponse.arrayBuffer();
        return new NextResponse(resourceData, {
          status: resourceResponse.status,
          headers: {
            'Content-Type': resourceResponse.headers.get('content-type') || 'application/octet-stream',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      } else {
        console.error(`[Middleware] Failed to fetch resource from SIMULATOR: ${resourceResponse.status} ${resourceResponse.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching resource from SIMULATOR microfrontend:', error);
    }
    
    // Si falla, continuar con el flujo normal
    return NextResponse.next();
  }

  // Si es un recurso estático sin referer de /author o /simulator, dejar que los rewrites lo manejen
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/img/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/public/')
  ) {
    return NextResponse.next();
  }

  // Interceptar rutas del microfrontend AUTHOR que vienen sin prefijo /author
  // Estas rutas son: /work, /about, /gallery, /blog, etc.
  // Si vienen de /author (detectado por referer), redirigirlas al microfrontend AUTHOR
  
  // Lista de rutas conocidas del microfrontend AUTHOR
  const authorRoutes = ['/work', '/about', '/gallery', '/blog'];
  const isAuthorRoute = authorRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));
  
  if (isAuthorRoute && isFromAuthor) {
    // Esta es una ruta del microfrontend AUTHOR accedida desde /author
    const microfrontendUrl = new URL(pathname, MICROFRONTEND_AUTHOR_URL);
    
    // Agregar query params si existen
    request.nextUrl.searchParams.forEach((value: string, key: string) => {
      microfrontendUrl.searchParams.set(key, value);
    });

    console.log(`[Middleware] Intercepting AUTHOR route: ${pathname} -> ${microfrontendUrl.toString()}`);

    try {
      const response = await fetch(microfrontendUrl.toString(), {
        headers: {
          'User-Agent': request.headers.get('user-agent') || '',
          'Accept': request.headers.get('accept') || 'text/html',
          'Accept-Language': request.headers.get('accept-language') || 'es',
        },
      });

      if (response.ok) {
        let html = await response.text();
        const baseUrl = MICROFRONTEND_AUTHOR_URL.replace(/\/$/, '');
        
        // Reescribir URLs relativas a absolutas
        html = html.replace(/\s(href|src)=["']([^"']+)["']/gi, (match, attr, url) => {
          if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:') || url.startsWith('#')) {
            return match;
          }
          if (url.startsWith('/')) {
            return ` ${attr}="${baseUrl}${url}"`;
          }
          return match;
        });
        
        // También reescribir en otros lugares (srcset, etc.)
        html = html.replace(/srcset=["']([^"']+)["']/gi, (match, srcset) => {
          const rewritten = srcset.split(',').map((item: string) => {
            const parts = item.trim().split(/\s+/);
            const url = parts[0];
            const descriptor = parts.slice(1).join(' ');
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:')) {
              return item;
            }
            if (url.startsWith('/')) {
              return `${baseUrl}${url}${descriptor ? ' ' + descriptor : ''}`;
            }
            return item;
          }).join(', ');
          return `srcset="${rewritten}"`;
        });

        return new NextResponse(html, {
          status: response.status,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        });
      }
    } catch (error) {
      console.error(`[Middleware] Error fetching AUTHOR route ${pathname}:`, error);
    }
    
    // Si falla, continuar con el flujo normal
    return NextResponse.next();
  }

  // Determinar qué microfrontend usar según la ruta
  let microfrontendBaseUrl: string;
  let microfrontendPath: string;

  // PRIORIDAD: Verificar /author PRIMERO antes que otras rutas
  if (pathname === '/author' || pathname.startsWith('/author/')) {
    console.log(`[Middleware] Detected /author route: ${pathname}`);
    microfrontendBaseUrl = MICROFRONTEND_AUTHOR_URL;
    // Para /author, siempre ir a la raíz del microfrontend (/)
    // Para /author/algo, ir a /algo del microfrontend
    if (pathname === '/author') {
      microfrontendPath = '/';
    } else {
      microfrontendPath = pathname.replace('/author', '');
    }
    console.log(`[Middleware] Will fetch: ${microfrontendBaseUrl}${microfrontendPath}`);
  } else if (pathname.startsWith('/simulator')) {
    microfrontendBaseUrl = MICROFRONTEND_SIMULATOR_URL;
    // Para /simulator, preservar el path completo incluyendo /simulator
    microfrontendPath = pathname;
  } else if (pathname.startsWith('/onboarding')) {
    microfrontendBaseUrl = MICROFRONTEND_ONBOARDING_URL;
    // Para /onboarding, preservar el path completo incluyendo /onboarding
    microfrontendPath = pathname;
  } else {
    return NextResponse.next();
  }

  // Interceptar el HTML del microfrontend y reescribir URLs relativas a absolutas
  try {
    // Asegurar que el path siempre empiece con /
    const normalizedPath = microfrontendPath.startsWith('/') 
      ? microfrontendPath 
      : `/${microfrontendPath}`;
    
    const microfrontendUrl = new URL(normalizedPath, microfrontendBaseUrl);
      
    // Agregar query params si existen
    request.nextUrl.searchParams.forEach((value: string, key: string) => {
      microfrontendUrl.searchParams.set(key, value);
    });

    console.log(`[Middleware] Fetching: ${microfrontendUrl.toString()} (from ${pathname})`);

    const response = await fetch(microfrontendUrl.toString(), {
      headers: {
        'User-Agent': request.headers.get('user-agent') || '',
        'Accept': request.headers.get('accept') || 'text/html',
        'Accept-Language': request.headers.get('accept-language') || 'es',
      },
    });

    if (!response.ok) {
      console.error(`[Middleware] Failed to fetch ${microfrontendUrl.toString()}: ${response.status} ${response.statusText}`);
      // Si es 404 y estamos en /author, intentar redirigir al home
      if (response.status === 404 && pathname.startsWith('/author') && pathname !== '/author') {
        console.log(`[Middleware] 404 for ${pathname}, trying home instead`);
        const homeUrl = new URL('/', microfrontendBaseUrl);
        const homeResponse = await fetch(homeUrl.toString(), {
          headers: {
            'User-Agent': request.headers.get('user-agent') || '',
            'Accept': request.headers.get('accept') || 'text/html',
            'Accept-Language': request.headers.get('accept-language') || 'es',
          },
        });
        if (homeResponse.ok) {
          let html = await homeResponse.text();
          const baseUrl = microfrontendBaseUrl.replace(/\/$/, '');
          // Reescribir URLs (usar la misma lógica de abajo)
          html = html.replace(/\s(href|src)=["']([^"']+)["']/gi, (match, attr, url) => {
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//') || url.startsWith('data:') || url.startsWith('#')) {
              return match;
            }
            if (url.startsWith('/')) {
              return ` ${attr}="${baseUrl}${url}"`;
            }
            return match;
          });
          return new NextResponse(html, {
            status: homeResponse.status,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
          });
        }
      }
      return NextResponse.next();
    }

      let html = await response.text();

      // Reescribir URLs relativas a absolutas en el HTML
      // Esto es necesario porque el navegador resuelve las rutas relativas desde el dominio actual
      const baseUrl = microfrontendBaseUrl.replace(/\/$/, '');
      
      // Función helper para reescribir URLs relativas
      const rewriteUrl = (url: string): string => {
        // Si ya es absoluta o es un protocolo/data URI, no cambiar
        if (url.startsWith('http://') || url.startsWith('https://') || 
            url.startsWith('//') || url.startsWith('data:') || url.startsWith('#')) {
          return url;
        }
        // Si empieza con /, es una ruta absoluta relativa al dominio
        if (url.startsWith('/')) {
          // Para /simulator, reescribir recursos estáticos a rutas con prefijo /simulator
          // para que el middleware pueda interceptarlos correctamente
          if (pathname.startsWith('/simulator')) {
            // Los recursos estáticos se reescriben con el prefijo /simulator
            if (url.startsWith('/_next') || url.startsWith('/static') || url.startsWith('/images') || 
                url.startsWith('/img') || url.startsWith('/assets') || url.startsWith('/public')) {
              // Mantener la ruta relativa pero asegurar que el middleware la intercepte
              // El middleware ya intercepta estos recursos cuando vienen de /simulator
              return url; // Mantener relativo - el middleware lo interceptará
            }
          }
          // Para /author, reescribir URLs a absolutas del microfrontend
          // Los recursos de Next.js (_next/static) deben ir directamente al dominio base
          if (url.startsWith('/_next') || url.startsWith('/static') || url.startsWith('/images') || 
              url.startsWith('/img') || url.startsWith('/assets') || url.startsWith('/public')) {
            return `${baseUrl}${url}`;
          }
          // Para otras rutas, también usar URLs absolutas del microfrontend
          return `${baseUrl}${url}`;
        }
        // Si es relativa (empieza sin /), mantenerla relativa (puede que funcione)
        return url;
      };

      // Reemplazar en atributos href y src (más específico para evitar conflictos)
      html = html.replace(
        /\s(href|src)=["']([^"']+)["']/gi,
        (match, attr, url) => {
          const rewritten = rewriteUrl(url);
          return ` ${attr}="${rewritten}"`;
        }
      );

      // Reemplazar en srcset (para imágenes responsivas)
      html = html.replace(
        /srcset=["']([^"']+)["']/gi,
        (match, srcset) => {
          // srcset puede tener múltiples URLs separadas por comas
          const rewritten = srcset.split(',').map((item: string) => {
            const parts = item.trim().split(/\s+/);
            const url = parts[0];
            const descriptor = parts.slice(1).join(' ');
            return `${rewriteUrl(url)}${descriptor ? ' ' + descriptor : ''}`;
          }).join(', ');
          return `srcset="${rewritten}"`;
        }
      );

      // Reemplazar en atributos data-*
      html = html.replace(
        /(data-[^=]+)=["']([^"']+)["']/gi,
        (match, attr, url) => {
          // Solo reescribir si parece una URL
          if (url.startsWith('/') || url.startsWith('http')) {
            const rewritten = rewriteUrl(url);
            return `${attr}="${rewritten}"`;
          }
          return match;
        }
      );

      // Reemplazar URLs en estilos inline (style="background-image: url(...)")
      html = html.replace(
        /style=["']([^"']*)url\(([^)]+)\)([^"']*)["']/gi,
        (match, before, url, after) => {
          const cleanUrl = url.replace(/["']/g, '').trim();
          const rewritten = rewriteUrl(cleanUrl);
          return `style="${before}url(${rewritten})${after}"`;
        }
      );

      // Reemplazar en <link> tags (CSS, etc.)
      html = html.replace(
        /<link([^>]+)href=["']([^"']+)["']([^>]*)>/gi,
        (match, before, url, after) => {
          const rewritten = rewriteUrl(url);
          return `<link${before}href="${rewritten}"${after}>`;
        }
      );

      // Reemplazar en <script> tags
      html = html.replace(
        /<script([^>]+)src=["']([^"']+)["']([^>]*)>/gi,
        (match, before, url, after) => {
          const rewritten = rewriteUrl(url);
          return `<script${before}src="${rewritten}"${after}>`;
        }
      );

      // Reemplazar en <img> tags (incluyendo todos los atributos posibles)
      html = html.replace(
        /<img([^>]*)\ssrc=["']([^"']+)["']([^>]*)>/gi,
        (match, before, url, after) => {
          const rewritten = rewriteUrl(url);
          return `<img${before} src="${rewritten}"${after}>`;
        }
      );

      // Reemplazar en <source> tags (para picture elements)
      html = html.replace(
        /<source([^>]*)\s(srcset|src)=["']([^"']+)["']([^>]*)>/gi,
        (match, before, attr, url, after) => {
          if (attr === 'srcset') {
            const rewritten = url.split(',').map((item: string) => {
              const parts = item.trim().split(/\s+/);
              const urlPart = parts[0];
              const descriptor = parts.slice(1).join(' ');
              return `${rewriteUrl(urlPart)}${descriptor ? ' ' + descriptor : ''}`;
            }).join(', ');
            return `<source${before} srcset="${rewritten}"${after}>`;
          } else {
            const rewritten = rewriteUrl(url);
            return `<source${before} src="${rewritten}"${after}>`;
          }
        }
      );


    return new NextResponse(html, {
      status: response.status,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Error fetching microfrontend:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/author',
    '/author/:path*',
    '/simulator',
    '/simulator/:path*',
    '/onboarding',
    '/onboarding/:path*',
    // Interceptar rutas del microfrontend AUTHOR (para verificar si vienen de /author)
    '/work',
    '/work/:path*',
    '/about',
    '/about/:path*',
    '/gallery',
    '/gallery/:path*',
    '/blog',
    '/blog/:path*',
    // También interceptar recursos estáticos que pueden venir de /author
    // IMPORTANTE: _next/image debe estar aquí para interceptar peticiones de optimización de imágenes
    '/_next/image',
    '/_next/static/:path*',
    '/static/:path*',
    '/images/:path*',
    '/img/:path*',
    '/assets/:path*',
  ],
};

