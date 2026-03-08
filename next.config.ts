/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Bu satır 'out' klasörünü oluşturur
  images: {
    unoptimized: true, // Sunumda resim hatalarını engeller
  },
};

export default nextConfig;