import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization for performance
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression for all responses
  compress: true,

  // Optimize CSS for faster first paint
  experimental: {
    optimizeCss: true,
  },

  // Security headers for HIPAA-compliant mental health platform
  async headers() {
    // Check if we're in development environment
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Allow Supabase connections (both local and production)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const connectSources = [
      "'self'",
      'https://vitals.vercel-insights.com',
      'https://va.vercel-scripts.com',
      // Add Supabase URL to allowed connections
      ...(supabaseUrl ? [supabaseUrl] : []),
    ].join(' ')

    // Build CSP directives conditionally
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      `connect-src ${connectSources}`,
      "frame-src 'self' https://tidycal.com https://www.youtube.com https://www.youtube-nocookie.com",
      "media-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      // Only upgrade to HTTPS in production (causes ERR_SSL_PROTOCOL_ERROR in dev)
      ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
    ]

    return [
      {
        source: '/:path*',
        headers: [
          // Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Control referrer information sent to external sites
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Prevent clickjacking attacks (SAMEORIGIN allows TidyCal/YouTube embeds)
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Force HTTPS connections for 1 year (production only)
          ...(isDevelopment ? [] : [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          }]),
          // Disable unnecessary browser features for privacy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Content Security Policy - allows TidyCal booking and YouTube embeds
          {
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
