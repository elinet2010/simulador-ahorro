import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Evitar prerender de páginas de error durante el build
  experimental: {
    // Esto ayuda a evitar problemas con el prerender de páginas de error
  },
};

export default nextConfig;
