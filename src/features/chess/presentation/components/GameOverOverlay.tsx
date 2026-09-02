import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

type GameOverOverlayProps = {
    result: "checkmate" | "stalemate";
    winner: "white" | "black" | null;
    onNewGame: () => void;
};

export function GameOverOverlay({
    winner,
    onNewGame,
    result,
}: GameOverOverlayProps) {
    const scale = useRef(new Animated.Value(0.7)).current;

    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
            }),

            Animated.timing(opacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }),
        ]).start();
    }, [opacity, scale]);

    const title = result === "checkmate" ? "CHECKMATE" : "STALEMATE";

    const resultText =
        result === "stalemate"
            ? "DRAW"
            : winner === "white"
              ? "WHITE WINS"
              : "BLACK WINS";

    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.72)",
                zIndex: 100,
            }}
        >
            <Animated.View
                style={{
                    opacity,
                    transform: [{ scale }],
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "800",
                        color: "#FACC15",
                    }}
                >
                    {title}
                </Text>

                <Text
                    style={{
                        marginTop: 12,
                        fontSize: 38,
                        fontWeight: "900",
                        color: "#FFFFFF",
                    }}
                >
                    {resultText}
                </Text>

                <Pressable
                    onPress={onNewGame}
                    style={{
                        marginTop: 28,
                        paddingHorizontal: 24,
                        paddingVertical: 12,
                        borderRadius: 10,
                        backgroundColor: "#FFFFFF",
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "700",
                            fontSize: 16,
                        }}
                    >
                        NEW GAME
                    </Text>
                </Pressable>
            </Animated.View>
        </View>
    );
}
