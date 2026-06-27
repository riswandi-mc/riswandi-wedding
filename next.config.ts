import type { NextConfig } from "next";

type RemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseRemotePattern: RemotePattern | null = supabaseUrl
  ? (() => {
      const url = new URL(supabaseUrl);

      return {
        protocol: url.protocol.replace(":", "") as "http" | "https",
        hostname: url.hostname,
        pathname: "/**",
      };
    })()
  : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...(supabaseRemotePattern ? [supabaseRemotePattern] : []),
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },
};

export default nextConfig;
