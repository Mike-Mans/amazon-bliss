/** @type {import('next').NextConfig} */
const nextConfig = {
  // static export for GitHub Pages; basePath is injected in CI by
  // actions/configure-pages so local dev stays at /
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
