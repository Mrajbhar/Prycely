/**
 * Access token lives in memory only — a lost tab means a lost token, which is
 * exactly what we want. The refresh token persists so a reload can silently
 * re-authenticate.
 *
 * Tradeoff worth naming: localStorage is readable by any script on the page,
 * so an XSS bug exposes the refresh token. The properly hardened alternative is
 * an httpOnly cookie, which requires backend changes. This is the standard SPA
 * compromise, not the ideal.
 */
const REFRESH_KEY = 'prycely.refreshToken';

let accessToken: string | null = null;

export const tokenStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },

  getRefreshToken: () => localStorage.getItem(REFRESH_KEY),
  setRefreshToken: (token: string) => localStorage.setItem(REFRESH_KEY, token),

  clear: () => {
    accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
  },
};