const repoName = process.env.NEXT_PUBLIC_PAGES_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: repoName,
  assetPrefix: repoName
}

module.exports = nextConfig
