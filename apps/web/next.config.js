/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    unoptimized: true, // Required for static export
  },
  trailingSlash: true,
  output: 'export',
  // Disable basePath for now to avoid build issues
  // basePath: process.env.NODE_ENV === 'production' ? '/salon-connect' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/salon-connect/' : '',
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://salon-connect-api.onrender.com/api',
  },
}

module.exports = nextConfig