export const DEFAULT_AVATAR_URL = "/default-avatar.svg";
export const DEFAULT_PROJECT_IMAGE_URL = "/default-project.svg";

const CLOUDINARY_UPLOAD_PATTERN =
  /^(https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

function hasValue(value?: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function resolveAvatarUrl(url?: string | null): string {
  return hasValue(url) ? url.trim() : DEFAULT_AVATAR_URL;
}

export function resolveProjectImageUrl(url?: string | null): string {
  return hasValue(url) ? url.trim() : DEFAULT_PROJECT_IMAGE_URL;
}

function withCloudinaryTransformations(url: string, transformations: string): string {
  const match = CLOUDINARY_UPLOAD_PATTERN.exec(url);
  if (!match) return url;

  const [, prefix, remainder] = match;
  const segments = remainder.split("/");
  // A version segment looks like `v1795208976`. Anything else right after
  // `/upload/` is an existing transformation chain and must be replaced.
  const hasTransformations = segments.length > 1 && !/^v\d+$/.test(segments[0]);
  const publicId = hasTransformations ? segments.slice(1).join("/") : remainder;

  return `${prefix}${transformations}/${publicId}`;
}

/**
 * CDN-resized avatar. Width-only keeps the original aspect ratio so the CSS
 * `object-cover object-top` still controls the crop (also works on non-square
 * uploads and needs no signed transformations).
 */
export function getAvatarImageUrl(url: string, size: number): string {
  return withCloudinaryTransformations(url, `w_${size},q_auto,f_auto`);
}

/** Responsive candidates for the hero avatar. Non-Cloudinary URLs stay as-is. */
export function getAvatarSrcSet(url: string, sizes: number[]): string | undefined {
  if (!CLOUDINARY_UPLOAD_PATTERN.test(url)) return undefined;

  return sizes.map((size) => `${getAvatarImageUrl(url, size)} ${size}w`).join(", ");
}

/** Full avatar for the zoom modal, capped so we never ship a 1700px original. */
export function getFullAvatarImageUrl(url: string): string {
  return withCloudinaryTransformations(url, "c_limit,w_1200,q_auto,f_auto");
}
