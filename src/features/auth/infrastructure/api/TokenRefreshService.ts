
import { tokenStorage } from "../storage/TokenStorage";
import { RefreshRejectedError, refreshRequest } from "./authApi";

const REFRESH_BEFORE_EXPIRY_MS = 60_000;

// Share one refresh operation across the entire app.
let refreshPromise: Promise<string> | null = null;

export class SessionExpiredError extends Error {
  constructor() {
    super("Your session has expired. Please log in again.");
    this.name = "SessionExpiredError";
  }
}

async function refreshAccessToken(): Promise<string> {
  let refreshToken: string | null;

  try {
    refreshToken = await tokenStorage.getRefreshToken();
  } catch {
    // SecureStore failed. Preserve credentials and allow retry.
    throw new Error("Unable to access the stored session.");
  }

  if (!refreshToken) {
    try {
      await tokenStorage.clear();
    } catch {
      // Storage cleanup failed; the session still cannot be refreshed.
    }

    throw new SessionExpiredError();
  }

  try {
    const result = await refreshRequest(refreshToken);

    await tokenStorage.saveSession({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      accessTokenExpiresAt: Date.now() + result.expiresIn * 1000,
    });

    return result.accessToken;
  } catch (error) {
    if (error instanceof RefreshRejectedError) {
      try {
        await tokenStorage.clear();
      } catch {
        // Report the expired session even if cleanup fails.
      }

      throw new SessionExpiredError();
    }

    throw error;
  }
}

export const tokenRefreshService = {
  /**
   * Returns a valid access token, refreshing it if it is expired
   * or about to expire.
   */
  async getValidAccessToken(): Promise<string> {
    const accessToken = await tokenStorage.get();
    const refreshToken = await tokenStorage.getRefreshToken();
    const expiresAt = await tokenStorage.getAccessTokenExpiresAt();

    if (!refreshToken) {
      if (!accessToken) {
        throw new SessionExpiredError();
      }

      // Legacy session: the old app saved only an access token.
      // Its expiry isn't known, so it cannot be safely refreshed.
      await tokenStorage.clear();
      throw new SessionExpiredError();
    }

    const needsRefresh =
      !accessToken ||
      expiresAt === null ||
      expiresAt <= Date.now() + REFRESH_BEFORE_EXPIRY_MS;

    if (!needsRefresh) {
      return accessToken;
    }

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  },

  /**
   * Forces a refresh. Useful when a server explicitly rejects
   * an access token, provided the caller handles retry safely.
   */
  async forceRefresh(): Promise<string> {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    return refreshPromise;
  },
};
