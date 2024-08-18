/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  },
  images: {
    domains: ['covers.openlibrary.org'],
  },
  experimental: {
    // This disables the warning about useSearchParams
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig