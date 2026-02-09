import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// URLs de los microfrontends
const MICROFRONTEND_SIMULATOR_URL =
  process.env.NEXT_PUBLIC_MICROFRONTEND_SIMULATOR_URL ||
  'https://simulador-ahorro-front.vercel.app';
const MICROFRONTEND_AUTHOR_URL =
  process.env.NEXT_PUBLIC_MICROFRONTEND_AUTHOR_URL ||
  'https://elizabeth-velasquez.vercel.app';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Si es un recurso estático que viene de /author, redirigirlo al microfrontend AUTHOR
  // Esto es necesario porque los rewrites genéricos redirigen al SIMULATOR
  if (
    (pathname.startsWith('/_next/') ||
     pathname.startsWith('/static/') ||
     pathname.startsWith('/images/') ||
     pathname.startsWith('/img/') ||
     pathname.startsWith('/assets/') ||
     pathname.startsWith('/public/')) &&
    request.headers.get('referer')?.includes('/author')
  ) {
    // Redirigir recursos estáticos al microfrontend AUTHOR si vienen de /author
    const resourcePath = pathname;
    const authorUrl = `${MICROFRONTEND_AUTHOR_URL}${resourcePath}`;
    
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
      }
    } catch (error) {
      console.error('Error fetching resource from AUTHOR microfrontend:', error);
    }
    
    // Si falla, continuar con el flujo normal
    return NextResponse.next();
  }

  // Si es un recurso estático sin referer de /author, dejar que los rewrites lo manejen
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

  // Determinar qué microfrontend usar según la ruta
  let microfrontendBaseUrl: string;
  let microfrontendPath: string;

  if (pathname.startsWith('/author')) {
    microfrontendBaseUrl = MICROFRONTEND_AUTHOR_URL;
    // Para /author, preservar el path completo incluyendo /author
    microfrontendPath = pathname;
  } else if (pathname.startsWith('/simulator') || pathname.startsWith('/onboarding') ) {
    microfrontendBaseUrl = MICROFRONTEND_SIMULATOR_URL;
    microfrontendPath = pathname.replace('/simulator', '').replace('/onboarding', '') || '/';
  } else {
    return NextResponse.next();
  }

  // Interceptar el HTML del microfrontend y reescribir URLs relativas a absolutas
  try {
    const microfrontendUrl = new URL(microfrontendPath, microfrontendBaseUrl);
      
      // Agregar query params si existen
      request.nextUrl.searchParams.forEach((value: string, key: string) => {
        microfrontendUrl.searchParams.set(key, value);
      });

      const response = await fetch(microfrontendUrl.toString(), {
        headers: {
          'User-Agent': request.headers.get('user-agent') || '',
          'Accept': request.headers.get('accept') || 'text/html',
          'Accept-Language': request.headers.get('accept-language') || 'es',
        },
      });

      if (!response.ok) {
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
          // Para /author, si la URL no incluye /author, agregarlo para mantener consistencia
          // Pero solo si estamos en el contexto de /author
          if (pathname.startsWith('/author') && !url.startsWith('/author') && !url.startsWith('/_next')) {
            // Para rutas que no son recursos de Next.js, mantenerlas como están
            // Los recursos de Next.js (_next/static) deben ir directamente al dominio base
            return `${baseUrl}${url}`;
          }
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
    '/author/:path*',
    '/simulator/:path*',
    // También interceptar recursos estáticos que pueden venir de /author
    '/_next/static/:path*',
    '/_next/image',
    '/static/:path*',
    '/images/:path*',
    '/img/:path*',
    '/assets/:path*',
  ],
};

