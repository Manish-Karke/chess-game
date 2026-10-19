
import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "chess_access_token";
const REFRESH_TOKEN_KEY = "chess_refresh_token";
const ACCESS_TOKEN_EXPIRY_KEY = "chess_access_token_expiry";

export type StoredSession = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
};

export const tokenStorage = {
  async saveSession(
    session: StoredSession,
  ): Promise<void> {
    // Store the token pair and expiry securely.
    await SecureStore.setItemAsync(
      ACCESS_TOKEN_KEY,
      session.accessToken,
    );
    await SecureStore.setItemAsync(
      REFRESH_TOKEN_KEY,
      session.refreshToken,
    );
    await SecureStore.setItemAsync(
      ACCESS_TOKEN_EXPIRY_KEY,
      String(session.accessTokenExpiresAt),
    );
  },

  async save(token: string): Promise<void> {
    // Backwards-compatible helper for existing callers.
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  async get(): Promise<string | null> {
    // Backwards-compatible access-token getter.
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  },

  async getAccessTokenExpiresAt(): Promise<number | null> {
    const value = await SecureStore.getItemAsync(
      ACCESS_TOKEN_EXPIRY_KEY,
    );

    if (!value) return null;

    const expiry = Number(value);
    return Number.isFinite(expiry) ? expiry : null;
  },

  async clear(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRY_KEY),
    ]);
  },
};
