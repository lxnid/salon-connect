const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    // Keep unoptimized in dev to simplify image handling
    unoptimized: true,
  },
  // Produce a static export only for production builds so Render can publish apps/web/out
  output: isProd ? 'export' : undefined,
  env: {
    // Point to local API default port (apps/api uses 5002 by default in this workspace)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api',
  },
  // Enable React strict mode in dev for better error surfaces
  reactStrictMode: true,
}

module.exports = nextConfig