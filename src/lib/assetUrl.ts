/** Turns a server-relative upload path into an absolute URL. */
export function assetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path; // already absolute (seed placeholders)

  // Strip the trailing "/api" from VITE_API_URL to get the server root.
  const apiBase = import.meta.env.VITE_API_URL as string;
  const origin = apiBase.replace(/\/api\/?$/, '');
  return `${origin}${path}`;
}