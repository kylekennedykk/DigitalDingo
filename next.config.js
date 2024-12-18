
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: ['firebasestorage.googleapis.com', 'digitaldingo.uk'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '/v0/b/digitaldingo-uk.firebasestorage.app/**',
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      }
    }
    return config
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['0.0.0.0', 'digitaldingo.uk']
    }
  }
}

module.exports = nextConfig
