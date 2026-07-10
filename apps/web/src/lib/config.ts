export const WORKSPACE_SLUG = process.env.NEXT_PUBLIC_WORKSPACE_SLUG ?? "pradeep-sahoo-studio";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Browser uses same-origin proxy; server components call API directly. */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api/v1";
}
