import type { NextConfig } from "next";
import { productionBasePath } from "./lib/asset-path";

const basePath = process.env.NODE_ENV === "production" ? productionBasePath : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath,
  images: { unoptimized: true },
};

export default nextConfig;
