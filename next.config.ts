import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', 'localhost'],

  images: {
    remotePatterns: [new URL('https://res.cloudinary.com/**')],
  },

}


export default nextConfig;
