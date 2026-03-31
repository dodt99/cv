import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow remote images from picsum.photos in the demo
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],

    // Optional: add AVIF support (heavier CPU but best compression)
    // formats: ["image/avif", "image/webp"], // default is ["image/avif", "image/webp"]

    // Optional: define the widths Next.js will generate in srcset
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
