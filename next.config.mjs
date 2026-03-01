/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**",
      },
      {
        protocol: "https",
        hostname: "bizpos.okobiz.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = {
  //       ...config.resolve.fallback,
  //       oracledb: false,
  //     };
  //   }
  //   return config;
  // },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        oracledb: false,
        pg: false,
        "pg-query-stream": false,
      };
    }

    // Exclude knex dynamic import warning
    config.module.rules.push({
      test: /knex\/lib\/migrations\/util\/import-file\.js$/,
      use: "null-loader",
    });

    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["knex"],
  },
};

export default nextConfig;
