
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  chessSocket,
  connectChessSocket,
} from "../../infrastructure/realtime/chessSocket";

type MatchmakingStatus =
  | "idle"
  | "connecting"
  | "searching"
  | "matched"
  | "timeout"
  | "error";

export type MatchFoundPayload = {
  gameId: string;
  whitePlayer: {
    playerId: string;
    socketId: string;
    color: "white";
  };
  blackPlayer: {
    playerId: string;
    socketId: string;
    color: "black";
  };
};

const MATCHMAKING_TIMEOUT_MS = 2 * 60 * 1000;

type UseOnlineMatchmakingParams = {
  onMatched: (match: MatchFoundPayload) => void;
  onTimeout: () => void;
};

export function useOnlineMatchmakingViewModel({
  onMatched,
  onTimeout,
}: UseOnlineMatchmakingParams) {
  const [status, setStatus] = useState<MatchmakingStatus>("idle");
  const [match, setMatch] = useState<MatchFoundPayload | null>(null);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(false);
  const startedRef = useRef(false);
  const onMatchedRef = useRef(onMatched);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onMatchedRef.current = onMatched;
    onTimeoutRef.current = onTimeout;
  }, [onMatched, onTimeout]);

  const clearMatchmakingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimeout = useCallback(() => {
    clearMatchmakingTimeout();

    timeoutRef.current = setTimeout(() => {
      chessSocket.emit("matchmaking:cancel");
      setStatus("timeout");
      onTimeoutRef.current();
    }, MATCHMAKING_TIMEOUT_MS);
  }, [clearMatchmakingTimeout]);

  const handleConnect = useCallback(() => {
    if (!mountedRef.current) return;

    chessSocket.emit("matchmaking:join");
    setStatus("searching");
    startTimeout();
  }, [startTimeout]);

  const startMatchmaking = useCallback(async () => {
    if (startedRef.current) return;

    startedRef.current = true;
    setMatch(null);
    setStatus("connecting");

    try {
      // Loads the saved token, sets socket.auth, then connects.
      await connectChessSocket();
      // The "connect" event handler emits matchmaking:join.
    } catch (error) {
      if (!mountedRef.current) return;

      startedRef.current = false;
      clearMatchmakingTimeout();
      setStatus("error");

      console.error(
        "Online matchmaking connection failed:",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }, [clearMatchmakingTimeout]);

  const cancelMatchmaking = useCallback(() => {
    clearMatchmakingTimeout();
    chessSocket.emit("matchmaking:cancel");

    startedRef.current = false;
    setStatus("idle");
  }, [clearMatchmakingTimeout]);

  useEffect(() => {
    mountedRef.current = true;

    const handleSearching = () => {
      if (mountedRef.current) setStatus("searching");
    };

    const handleMatchFound = (payload: MatchFoundPayload) => {
      clearMatchmakingTimeout();
      setMatch(payload);
      setStatus("matched");
      onMatchedRef.current(payload);
    };

    const handleConnectError = (error: Error) => {
      clearMatchmakingTimeout();
      startedRef.current = false;

      if (mountedRef.current) {
        setStatus("error");
      }

      console.error("Chess socket connection error:", error.message);
    };

    const handleDisconnect = () => {
      clearMatchmakingTimeout();

      if (mountedRef.current && status !== "matched") {
        setStatus("error");
      }
    };

    chessSocket.on("connect", handleConnect);
    chessSocket.on("matchmaking:searching", handleSearching);
    chessSocket.on("matchmaking:found", handleMatchFound);
    chessSocket.on("connect_error", handleConnectError);
    chessSocket.on("disconnect", handleDisconnect);

    void startMatchmaking();

    return () => {
      mountedRef.current = false;
      clearMatchmakingTimeout();

      chessSocket.off("connect", handleConnect);
      chessSocket.off("matchmaking:searching", handleSearching);
      chessSocket.off("matchmaking:found", handleMatchFound);
      chessSocket.off("connect_error", handleConnectError);
      chessSocket.off("disconnect", handleDisconnect);
    };
  }, [startMatchmaking, handleConnect, clearMatchmakingTimeout]);

  return {
    status,
    match,
    cancelMatchmaking,
  };
}
