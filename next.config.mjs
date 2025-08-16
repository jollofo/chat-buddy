/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://snapcall.app https://*.livechatinc.com https://cdn.livechatinc.com",
            "connect-src 'self' https://api.livechatinc.com https://*.text.com https://*.livechatinc.com https://snapcall.app",
            "img-src 'self' data: https://*.livechatinc.com",
            "style-src 'self' 'unsafe-inline'",
            "frame-src https://*.livechatinc.com https://snapcall.app"
          ].join('; ')
        }
      ]
    }
  ],
};

export default nextConfig;

