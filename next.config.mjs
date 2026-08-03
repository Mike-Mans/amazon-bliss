/** @type {import('next').NextConfig} */

// Set by the deploy workflow ("/amazon-bliss" on GitHub Pages); empty for
// local dev. NEXT_PUBLIC_ so client code (three.js texture loading) can
// prefix runtime asset requests too.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
};

export default nextConfig;
