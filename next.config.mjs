/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // firebase-admin's auth module pulls in jwks-rsa -> jose. Turbopack's
  // server runtime (the "build" script now forces webpack instead, see
  // package.json) resolved jose to its ESM-only "webapi" export condition
  // but loaded it via require() semantics, throwing ERR_REQUIRE_ESM in
  // Vercel's deployed function on every route that touches firebase-admin
  // (login/register/session/admin) — not reproducible locally, since
  // `next start` runs against the full untraced node_modules. Keeping
  // firebase-admin external too so webpack leaves it as a plain Node
  // require() at runtime rather than bundling it.
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
