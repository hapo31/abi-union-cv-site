const Copy = require('copy-webpack-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "dist",
  webpack: (config) => {
    config.plugins.push(new Copy({
      patterns: [
        process.env['SQLITE_DB_NAME']
      ]
    }));

    return config;
  }
}

module.exports = nextConfig
