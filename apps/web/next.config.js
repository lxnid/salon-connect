/** @type {import('next').NextConfig | ((phase: string) => import('next').NextConfig)} */
const createConfig = (phase) => {
  const isDev = phase === 'phase-development-server'

  if (isDev) {
    // Development: avoid static export and asset prefix to ensure proper HMR and chunk loading
    return {
      images: {
        domains: ['res.cloudinary.com', 'images.unsplash.com'],
        unoptimized: true,
      },
      trailingSlash: true,
      // Do NOT set output: 'export' in dev
      // Do NOT set basePath/assetPrefix in dev
      env: {
        API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://salon-connect-api.onrender.com/api',
      },
    }
  }

  // Production / other phases
  return {
    images: {
      domains: ['res.cloudinary.com', 'images.unsplash.com'],
      unoptimized: true, // Required for static export
    },
    trailingSlash: true,
    output: 'export',
    // Configure basePath/assetPrefix for subpath deployments like GitHub Pages
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : '',
    env: {
      API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://salon-connect-api.onrender.com/api',
    },
  }
}

module.exports = createConfig