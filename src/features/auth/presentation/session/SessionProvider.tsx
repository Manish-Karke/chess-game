
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  tokenRefreshService,
  SessionExpiredError,
} from "@/features/auth/infrastructure/api/TokenRefreshService";

import { logoutRequest } from "@/features/auth/infrastructure/api/authApi";
import { tokenStorage } from "@/features/auth/infrastructure/storage/TokenStorage";
import { disconnectChessSocket } from "@/features/chess/infrastructure/realtime/chessSocket";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionContextValue = {
  status: SessionStatus;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue | undefined>(
  undefined,
);

export function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<SessionStatus>("loading");

  // Restore the session once when the app starts.
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        await tokenRefreshService.getValidAccessToken();

        if (active) {
          setStatus("authenticated");
        }
      } catch (error) {
        if (!active) return;

        if (error instanceof SessionExpiredError) {
          try {
            await tokenStorage.clear();
          } catch {
            console.warn("Unable to clear expired session.");
          }

          if (active) {
            setStatus("unauthenticated");
          }

          return;
        }

        // A temporary network error doesn't automatically mean
        // the saved session is invalid.
        try {
          const refreshToken = await tokenStorage.getRefreshToken();

          if (active) {
            setStatus(
              refreshToken ? "authenticated" : "unauthenticated",
            );
          }
        } catch {
          if (active) {
            setStatus("unauthenticated");
          }
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  // Refresh credentials without sending an already visible screen
  // back to the initial loading state.
  const refreshSession = useCallback(async () => {
    try {
      await tokenRefreshService.getValidAccessToken();
      setStatus("authenticated");
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        try {
          await tokenStorage.clear();
        } finally {
          setStatus("unauthenticated");
        }

        return;
      }

      const refreshToken = await tokenStorage.getRefreshToken();

      if (!refreshToken) {
        setStatus("unauthenticated");
      }

      // If a refresh fails temporarily but a refresh token exists,
      // preserve the current status instead of causing navigation.
    }
  }, []);

  const logout = useCallback(async () => {
    disconnectChessSocket();

    try {
      const refreshToken = await tokenStorage.getRefreshToken();

      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } catch {
      console.warn("Logout request failed; clearing local session.");
    } finally {
      try {
        await tokenStorage.clear();
      } finally {
        setStatus("unauthenticated");
      }
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{ status, refreshSession, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used inside SessionProvider");
  }

  return context;
}
