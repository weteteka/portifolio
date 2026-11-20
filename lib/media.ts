export const DEFAULT_AVATAR_URL = "/default-avatar.svg";
export const DEFAULT_PROJECT_IMAGE_URL = "/default-project.svg";

function hasValue(value?: string | null): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function resolveAvatarUrl(url?: string | null): string {
  return hasValue(url) ? url.trim() : DEFAULT_AVATAR_URL;
}

export function resolveProjectImageUrl(url?: string | null): string {
  return hasValue(url) ? url.trim() : DEFAULT_PROJECT_IMAGE_URL;
}
