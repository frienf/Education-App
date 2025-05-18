/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['https://gixljpbqbqbjdsilhvrl.supabase.co'], // For Supabase Storage (videos, images)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'https://gixljpbqbqbjdsilhvrl.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    // Enable if using App Router features that need optimization
    optimizePackageImports: ['framer-motion', 'zustand', '@supabase/supabase-js'],
  },
  
  // Ensure TypeScript errors don't break production builds (optional)
  typescript: {
    ignoreBuildErrors: false, // Set to true if you want to allow builds with TS errors
  },
  // Ensure ESLint errors don't break production builds (optional)
  eslint: {
    ignoreDuringBuilds: false, // Set to true to skip ESLint during builds
  },
};

module.exports = nextConfig;