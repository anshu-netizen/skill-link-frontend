/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/provider',
        permanent: true, // This tells browsers to cache the redirect
      },
    ];
  },
};

export default nextConfig;