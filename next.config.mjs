/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        //destination: 'http://127.0.0.1:8000/api/:path*',
        destination: 'https://managing-idiom-rack.ngrok-free.dev/api/:path*',
      },
    ];
  },
};

export default nextConfig;
