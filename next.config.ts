// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, // Skip TypeScript errors during build
  },
  images: {
    remotePatterns: [new URL('https://upload.wikimedia.org/**')],
  },
};

module.exports = nextConfig;
