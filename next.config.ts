import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true', // only enables it conditionally
});


const nextConfig: NextConfig = {
  images: {
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        // Google profile pictures (Google sign-in)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**"
      },
      {
        // Platform media bucket (Desc Hosting S3)
        protocol: "https",
        hostname: "weddconnect-s3.s3.eu-north-1.amazonaws.com",
        port: "",
        pathname: "/**"
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
};

export default withAnalyzer(nextConfig);
