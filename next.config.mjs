
const distDir = ".next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir,
  experimental: {
    appDir: true
  },
  serverRuntimeConfig: {
    distDir,
  }
}

export default nextConfig;