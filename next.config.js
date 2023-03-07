
const distDir = ".next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir,
  serverRuntimeConfig: {
    distDir,
  }
}

module.exports = nextConfig
