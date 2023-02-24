const Copy = require("copy-webpack-plugin")
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: process.env["OUTPUT_DIR"],
  webpack: (config) => {
    config.plugins.push(new Copy({
      patterns: [
        { from: process.env["SQLITE_DB_NAME"], to: path.join("static", "assets") }
      ]
    }));

    return config;
  }
}

module.exports = nextConfig
