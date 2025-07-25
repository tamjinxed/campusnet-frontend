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
    remotePatterns: [
        new URL('https://upload.wikimedia.org/**'),
        {
          protocol: 'https',
          hostname: process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', ''),
          pathname: '/storage/v1/object/public/**'
        }
    ],
  },
};

module.exports = nextConfig;
