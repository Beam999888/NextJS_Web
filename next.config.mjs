/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['chart.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'chart.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

