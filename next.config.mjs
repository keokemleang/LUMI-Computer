/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // firebase-admin/auth depends on jwks-rsa@4, which depends on jose@6 —
  // an ESM-only package with no CJS/"require" export condition. Node.js
  // only added the ability for require() to load an ESM graph directly
  // (jwks-rsa's own stated engine requirement) in 20.19.0 / 22.12.0 / 23+;
  // an older Node runtime throws ERR_REQUIRE_ESM the moment firebase-admin/
  // auth is imported, regardless of bundler. The real fix is pinning the
  // Node.js version (see "engines" in package.json), not the bundler —
  // keeping firebase-admin external here is just standard practice so it
  // isn't unnecessarily bundled.
  serverExternalPackages: ["firebase-admin"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "z-cdn.chatglm.cn" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    return [
      // /login/admin never existed as a route — admin sign-in uses the same
      // /login page as everyone else, gated by role after authentication.
      { source: "/login/admin", destination: "/login?callbackUrl=/admin", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
