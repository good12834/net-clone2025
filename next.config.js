// /** @type {import('next').NextConfig} */
// const path = require('path');

// const nextConfig = {
//   outputFileTracingRoot: path.join(__dirname),
//   images: {
//     domains: ['source.unsplash.com', 'localhost'],
//   },
//   // Allow cross-origin requests from network IPs (resolves Next.js warning)
//   // This allows development from different devices on the same network
//   allowedDevOrigins: [
//     'localhost',      // Standard localhost
//     '127.0.0.1',     // IPv4 localhost
//     '192.168.0.200', // Your current network IP
//     '192.168.1.1',   // Common router IP
//     '10.0.0.1'       // Alternative network IP
//   ],
//   // Removed rewrites to avoid conflicts with direct API calls
//   // Enable CORS headers for development
//   async headers() {
//     return [
//       {
//         source: '/api/:path*',
//         headers: [
//           { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
//           { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
//           { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
//         ],
//       },
//       // Allow video loading from external domains
//       {
//         source: '/(.*)',
//         headers: [
//           { key: 'Access-Control-Allow-Origin', value: '*' },
//           { key: 'Access-Control-Allow-Methods', value: 'GET,HEAD,OPTIONS' },
//           { key: 'Access-Control-Allow-Headers', value: 'Range,Accept-Encoding' },
//         ],
//       },
//     ]
//   },
// }

// module.exports = nextConfig