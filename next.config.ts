import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Envoi de photos et logos via les formulaires : 1 Mo par défaut est trop juste pour une
    // photo de téléphone. 4,5 Mo est le plafond d'une requête sur Vercel.
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
