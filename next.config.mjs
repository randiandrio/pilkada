/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "file.kuantar.co.id",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "file.jagoanpay.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "pay.kuantar.co.id",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "admin.jagoanpay.com",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      child_process: false,
      net: false,
      tls: false,
    };
    return config;
  },
};

// module.exports = nextConfig;
export default nextConfig;
