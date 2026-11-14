/** @type {import('next').NextConfig} */
// basePath is derived from the repository name on GitHub Actions, so the same
// code deploys to <owner>.github.io/<repo>/ for any repo (utopi-site, utopi, ...).
const [owner = "", repoName = ""] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const isUserOrOrgPages = repoName.toLowerCase() === `${owner.toLowerCase()}.github.io`;
const githubPagesBasePath =
  isGitHubActions && repoName && !isUserOrOrgPages ? `/${repoName}` : "";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? githubPagesBasePath;

const nextConfig = {
  output: "export",
  devIndicators: false,
  reactStrictMode: true,
  trailingSlash: true,
  basePath,
  // Expose the resolved basePath to the client bundle so static asset URLs
  // (paper figures, demo clips in src/lib/content.ts) get the same prefix.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  images: {
    unoptimized: true
  }
};

export default nextConfig;
