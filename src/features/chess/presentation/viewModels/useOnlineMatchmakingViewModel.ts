import { useCallback, useEffect, useRef, useState } from "react";

import { chessSocket } from "../../infrastructure/realtime/chessSocket";

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
    const clearMatchmakingTimeout = useCallback(() => {
        if (timeoutRef.current === null) {
            return;
        }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
    }, []);

    const startTimeout = useCallback(() => {
        clearMatchmakingTimeout();
        timeoutRef.current = setTimeout(() => {
            chessSocket.emit("matchmaking:cancel");
            setStatus("timeout");
            onTimeout();
        }, MATCHMAKING_TIMEOUT_MS);
    }, [clearMatchmakingTimeout, onTimeout]);

    const startMatchmaking = useCallback(() => {
        setMatch(null);
        setStatus("connecting");
        if (chessSocket.connected) {
            chessSocket.emit("matchmaking:join");
            setStatus("searching");
            startTimeout();
            return;
        }

        chessSocket.connect();
    }, [startTimeout]);

    const cancelMatchmaking = useCallback(() => {
        clearMatchmakingTimeout();
        chessSocket.emit("matchmaking:cancel");
        setStatus("idle");
    }, [clearMatchmakingTimeout]);

    useEffect(() => {
        const handleConnect = () => {
            chessSocket.emit("matchmaking:join");
            setStatus("searching");
            startTimeout();
        };

        const handleSearching = () => {
            setStatus("searching");
        };

        const handleMatchFound = (payload: MatchFoundPayload) => {
            clearMatchmakingTimeout();

            setMatch(payload);
            setStatus("matched");

            onMatched(payload);
        };
        const handleConnectError = (error: Error) => {
            clearMatchmakingTimeout();

            setStatus("error");
        };

        const handleDisconnect = (reason: string) => {};
        chessSocket.on("connect", handleConnect);
        chessSocket.on("matchmaking:searching", handleSearching);
        chessSocket.on("matchmaking:found", handleMatchFound);
        chessSocket.on("connect_error", handleConnectError);
        chessSocket.on("disconnect", handleDisconnect);
        startMatchmaking();
        return () => {
            clearMatchmakingTimeout();
            chessSocket.off("connect", handleConnect);
            chessSocket.off("matchmaking:searching", handleSearching);
            chessSocket.off("matchmaking:found", handleMatchFound);
            chessSocket.off("connect_error", handleConnectError);
            chessSocket.off("disconnect", handleDisconnect);
        };
    }, [startMatchmaking, startTimeout, clearMatchmakingTimeout, onMatched]);

    return {
        status,
        match,
        cancelMatchmaking,
    };
}
