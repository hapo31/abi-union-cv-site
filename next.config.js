/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    if (config.experiments == null) {
      config.experiments = {};
    }
    config.experiments.topLevelAwait = true;
    return config;
  }
}

module.exports = nextConfig
