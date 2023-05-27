
const distDir = ".next";

/** @type {import('next').NextConfig} */
export const nextConfig = {
  reactStrictMode: true,
  distDir,
  serverRuntimeConfig: {
    distDir,
  }
}
