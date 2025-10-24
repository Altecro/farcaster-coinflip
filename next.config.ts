/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => [
    {
      source: '/.well-known/farcaster.json',
      destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/019a12e8-db2b-713d-6a57-b010e66dde9a',
      permanent: false,  // Add this if it's a temporary redirect; set to true for permanent
    },
    // Add any other redirects here...
  ],
};

module.exports = nextConfig;