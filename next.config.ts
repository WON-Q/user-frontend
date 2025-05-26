const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "won-q-order-merchant.s3.ap-northeast-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    allowedDevOrigins: ["http://10.0.2.2:3000"],
  },
} as any;

export default nextConfig;
