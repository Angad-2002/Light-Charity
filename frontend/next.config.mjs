/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Temporarily disable static export to resolve build conflicts
  // output: 'export',
  trailingSlash: true,
  // distDir: 'out',
}

export default nextConfig
