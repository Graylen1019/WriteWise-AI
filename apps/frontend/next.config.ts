/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: {
      rules: {},
      root: "../../",
    },
    appDir: true,
  },
};

export default nextConfig;
