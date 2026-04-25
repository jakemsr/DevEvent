import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'res.cloudinary.com'
      }
    ]
  }
};

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', 'localhost'],
}


export default nextConfig;
