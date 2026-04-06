/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    OPENAQ_API_KEY: process.env.OPENAQ_API_KEY,
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  },
}

module.exports = nextConfig
