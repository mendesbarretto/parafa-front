import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  generateEtags: false, // Desabilitar para reduzir build time
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Reduzir uso de memória durante o build
    memoryBasedWorkersCount: true,
    // Otimizações agressivas de pacotes
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "parafa.com.br",
      },
    ],
    // Reduzir formato de imagem para build mais rápido
    formats: ["image/webp"],
    minimumCacheTTL: 60,
  },
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
