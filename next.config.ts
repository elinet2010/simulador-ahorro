import type { NextConfig } from "next";

// URLs de los microfrontends desde variables de entorno
const MICROFRONTEND_SIMULATOR_URL =
  process.env.NEXT_PUBLIC_MICROFRONTEND_SIMULATOR_URL ||
  "https://simulador-ahorro-front.vercel.app";
const MICROFRONTEND_ONBOARDING_URL =
  process.env.NEXT_PUBLIC_MICROFRONTEND_ONBOARDING_URL ||
  "https://simulador-ahorro-front.vercel.app";
const MICROFRONTEND_AUTHOR_URL =
  process.env.NEXT_PUBLIC_MICROFRONTEND_AUTHOR_URL ||
  "https://elizabeth-velasquez.vercel.app";

const nextConfig: NextConfig = {
  /* config options here */
  // Evitar prerender de páginas de error durante el build
  experimental: {
    // Esto ayuda a evitar problemas con el prerender de páginas de error
  },
  
  /** @type {import('next').NextConfig} */
  async rewrites() {
    // Verificar si los microfrontends están habilitados
    const microfrontendEnabled =
      process.env.NEXT_PUBLIC_MICROFRONTEND_ENABLED !== "false";

    if (!microfrontendEnabled) {
      return [];
    }

    return [
      // Rewrites para recursos estáticos del microfrontend AUTHOR (CSS, JS, imágenes, etc.)
      // Estos deben ir ANTES de las rutas de contenido para tener prioridad
      // Recursos estáticos de Next.js para /author
      {
        source: "/author/_next/static/:path*",
        destination: `${MICROFRONTEND_AUTHOR_URL}/_next/static/:path*`,
      },
      {
        source: "/author/_next/image",
        destination: `${MICROFRONTEND_AUTHOR_URL}/_next/image`,
      },
      {
        source: "/author/_next/webpack-hmr",
        destination: `${MICROFRONTEND_AUTHOR_URL}/_next/webpack-hmr`,
      },
      {
        source: "/author/static/:path*",
        destination: `${MICROFRONTEND_AUTHOR_URL}/static/:path*`,
      },
      {
        source: "/author/images/:path*",
        destination: `${MICROFRONTEND_AUTHOR_URL}/images/:path*`,
      },
      {
        source: "/author/img/:path*",
        destination: `${MICROFRONTEND_AUTHOR_URL}/img/:path*`,
      },
      {
        source: "/author/assets/:path*",
        destination: `${MICROFRONTEND_AUTHOR_URL}/assets/:path*`,
      },
      {
        source: "/author/public/:path*",
        destination: `${MICROFRONTEND_AUTHOR_URL}/public/:path*`,
      },
      // Rewrites para recursos estáticos del microfrontend SIMULATOR (CSS, JS, imágenes, etc.)
      // NOTA: Estos rewrites genéricos se aplican cuando NO hay prefijo de ruta específico
      // Para /author, los recursos deben usar los rewrites con prefijo /author/ arriba
      {
        source: "/_next/static/:path*",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/_next/static/:path*`,
      },
      {
        source: "/_next/image",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/_next/image`,
      },
      {
        source: "/_next/webpack-hmr",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/_next/webpack-hmr`,
      },
      {
        source: "/static/:path*",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/static/:path*`,
      },
      {
        source: "/images/:path*",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/images/:path*`,
      },
      {
        source: "/img/:path*",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/img/:path*`,
      },
      {
        source: "/assets/:path*",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/assets/:path*`,
      },
      {
        source: "/public/:path*",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/public/:path*`,
      },
      {
        source: "/favicon.ico",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/favicon.ico`,
      },
      {
        source: "/robots.txt",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/robots.txt`,
      },
      {
        source: "/sitemap.xml",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/sitemap.xml`,
      },
      // Ruta base /nuevo -> redirige a la raíz del microfrontend
      {
        source: "/nuevo",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/`,
      },
      // Rutas con sub-paths /nuevo/* -> preserva el path
      {
        source: "/nuevo/:path*",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/:path*`,
      },
      // Rutas con sub-paths /simulator/* -> preserva el path
      {
        source: "/simulator/:path*",
        destination: `${MICROFRONTEND_SIMULATOR_URL}/:path*`,
      },
      // Ruta base /onboarding -> redirige a /onboarding del microfrontend
      {
        source: "/onboarding",
        destination: `${MICROFRONTEND_ONBOARDING_URL}/onboarding`,
      },
      // Rutas con sub-paths /onboarding/* -> preserva el path
      {
        source: "/onboarding/:path*",
        destination: `${MICROFRONTEND_ONBOARDING_URL}/onboarding/:path*`,
      },
      // Ruta base /author -> redirige a la raíz del microfrontend AUTHOR
      {
        source: "/author",
        destination: `${MICROFRONTEND_AUTHOR_URL}/author`,
      },
      // Rutas con sub-paths /author/* -> preserva el path completo
      {
        source: "/author/:path*",
        destination: `${MICROFRONTEND_AUTHOR_URL}/author/:path*`,
      },
    ];
  },

  // Headers para CORS y seguridad cuando se usan microfrontends
  async headers() {
    return [
      {
        // Headers para recursos estáticos del microfrontend
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        // Headers para imágenes y otros recursos
        source: "/images/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        source: "/img/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        // Aplicar headers a las rutas de microfrontends
        source: "/nuevo/:path*",
        headers: [
          {
            key: "X-Forwarded-Host",
            value: process.env.NEXT_PUBLIC_APP_URL || "localhost:3000",
          },
          {
            key: "X-Forwarded-Proto",
            value: process.env.NODE_ENV === "production" ? "https" : "http",
          },
        ],
      },
      {
        source: "/simulator/:path*",
        headers: [
          {
            key: "X-Forwarded-Host",
            value: process.env.NEXT_PUBLIC_APP_URL || "localhost:3000",
          },
          {
            key: "X-Forwarded-Proto",
            value: process.env.NODE_ENV === "production" ? "https" : "http",
          },
        ],
      },
      {
        source: "/onboarding/:path*",
        headers: [
          {
            key: "X-Forwarded-Host",
            value: process.env.NEXT_PUBLIC_APP_URL || "localhost:3000",
          },
          {
            key: "X-Forwarded-Proto",
            value: process.env.NODE_ENV === "production" ? "https" : "http",
          },
        ],
      },
      {
        source: "/author/:path*",
        headers: [
          {
            key: "X-Forwarded-Host",
            value: process.env.NEXT_PUBLIC_APP_URL || "localhost:3000",
          },
          {
            key: "X-Forwarded-Proto",
            value: process.env.NODE_ENV === "production" ? "https" : "http",
          },
        ],
      },
      {
        // Headers para recursos estáticos del microfrontend AUTHOR
        source: "/author/_next/static/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        source: "/author/images/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        source: "/author/img/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        source: "/author/assets/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
      {
        source: "/author/static/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
