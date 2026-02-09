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
  ],
};

