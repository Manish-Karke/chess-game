
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

import {
  logoutRequest,
} from "@/features/auth/infrastructure/api/authApi";

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

  const refreshSession = useCallback(async () => {
    setStatus("loading");

    try {
      await tokenRefreshService.getValidAccessToken();
      setStatus("authenticated");
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        await tokenStorage.clear();
        setStatus("unauthenticated");
        return;
      }

      // A network failure doesn't necessarily mean the session
      // is invalid. Keep the stored session for a later retry.
      const refreshToken = await tokenStorage.getRefreshToken();

      if (refreshToken) {
        setStatus("authenticated");
        return;
      }

      setStatus("unauthenticated");
    }
  }, []);

 const logout = useCallback(async () => {
  // Disconnect locally first.
  disconnectChessSocket();

  try {
    const refreshToken = await tokenStorage.getRefreshToken();

    if (refreshToken) {
      await logoutRequest(refreshToken);
    }
  } catch {
    // Server or storage operation failed.
    // Continue attempting to clear local credentials.
    console.warn("Logout request or token retrieval failed.");
  } finally {
    try {
      await tokenStorage.clear();
    } finally {
      setStatus("unauthenticated");
    }
  }
}, []);

 useEffect(() => {
  let active = true;

  void (async () => {
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

      // A network failure alone does not prove the session is invalid.
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
  })();

  return () => {
    active = false;
  };
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
