/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages serves plain files — no Next.js server. Static export emits
  // real prerendered HTML per route, which is what keeps the site crawlable
  // and readable with JS disabled.
  output: 'export',

  // Pages has no image optimizer.
  images: { unoptimized: true },

  // Emit /work/braud-pipeline/index.html rather than /work/braud-pipeline.html
  // so the existing directory-style URLs keep working.
  trailingSlash: true,

  reactStrictMode: true,

  transpilePackages: ['three'],
};

export default nextConfig;
