/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gixljpbqbqbjdsilhvrl.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gixljpbqbqbjdsilhvrl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'zustand', '@supabase/supabase-js'],
  },
};
module.exports = nextConfig;