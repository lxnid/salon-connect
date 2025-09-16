const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    // Keep unoptimized in dev to simplify image handling
    unoptimized: true,
  },
  env: {
    // Point to local API default port (apps/api uses 5000 by default)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  },
  // Ensure local workspace packages with TS sources are transpiled correctly
  transpilePackages: ['@salon-connect/types'],
}

module.exports = nextConfig