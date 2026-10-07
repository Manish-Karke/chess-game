import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import { useCallback } from "react";

import { ChessBoard } from "@/components/chessBoard";

import { initialChessPieces } from "@/features/chess/domain/constants/initialChessPieces";

import {
    MatchFoundPayload,
    useOnlineMatchmakingViewModel,
} from "@/features/chess/presentation/viewModels/useOnlineMatchmakingViewModel";
import { chessSocket } from "@/features/chess/infrastructure/realtime/chessSocket";

export default function OnlineMatchmakingScreen() {
    // const handleMatched = useCallback((match: MatchFoundPayload) => {
    //     router.replace({
    //         pathname: "/game",

    //         params: {
    //             mode: "online",

    //             gameId: match.gameId,
    //         },
    //     });
    // }, []);
    const handleMatched = useCallback((match: MatchFoundPayload) => {
        const myColor =
            match.whitePlayer.socketId === chessSocket.id ? "white" : "black";
        router.replace({
            pathname: "/game",
            params: {
                mode: "online",
                gameId: match.gameId,
                color: myColor,
            },
        });
    }, []);
    const handleTimeout = useCallback(() => {
        router.replace("/");
    }, []);

    const { status, cancelMatchmaking } = useOnlineMatchmakingViewModel({
        onMatched: handleMatched,

        onTimeout: handleTimeout,
    });

    const handleCancel = useCallback(() => {
        cancelMatchmaking();

        router.replace("/");
    }, [cancelMatchmaking]);

    const title =
        status === "connecting"
            ? "Connecting..."
            : status === "error"
              ? "Connection failed"
              : "Finding opponent";

    const description =
        status === "connecting"
            ? "Connecting to chess server..."
            : status === "error"
              ? "Unable to connect to the server."
              : "Searching for an available player...";

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#F5F1E8",
            }}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Board preview */}
                <View pointerEvents="none">
                    <ChessBoard
                        pieces={initialChessPieces}
                        selectedSquare={null}
                        validMoves={[]}
                        checkedKingPosition={null}
                        lastMove={null}
                        onSquarePress={() => {}}
                    />
                </View>

                {/* Matchmaking overlay */}
                <View
                    style={{
                        position: "absolute",

                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,

                        backgroundColor: "rgba(0,0,0,0.35)",

                        alignItems: "center",

                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",

                            borderRadius: 20,

                            paddingHorizontal: 32,

                            paddingVertical: 28,

                            alignItems: "center",

                            minWidth: 260,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 38,
                            }}
                        >
                            🔍
                        </Text>

                        <Text
                            style={{
                                fontSize: 20,

                                fontWeight: "700",

                                marginTop: 14,
                            }}
                        >
                            {title}
                        </Text>

                        <Text
                            style={{
                                marginTop: 8,

                                color: "#666",

                                textAlign: "center",
                            }}
                        >
                            {description}
                        </Text>

                        {status !== "error" && (
                            <ActivityIndicator
                                size="large"
                                style={{
                                    marginTop: 20,
                                }}
                            />
                        )}

                        {status === "searching" && (
                            <Pressable
                                onPress={handleCancel}
                                style={{
                                    marginTop: 24,

                                    paddingHorizontal: 24,

                                    paddingVertical: 12,

                                    borderRadius: 10,

                                    backgroundColor: "#EFEFEF",
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: "600",
                                    }}
                                >
                                    Cancel Search
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
