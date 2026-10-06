export const productionBasePath = "/anniversary-site";

/** Public assets need the same build-time prefix as Next's JS and CSS. */
export function assetPath(source: string, basePath = process.env.NODE_ENV === "production" ? productionBasePath : "") {
  if (!basePath || !source.startsWith("/") || source.startsWith("//")) return source;
  if (source === basePath || source.startsWith(`${basePath}/`)) return source;
  return `${basePath}${source}`;
}
