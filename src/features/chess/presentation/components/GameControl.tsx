import React from "react";
import {
    Alert,
    Pressable,
    Text,
    View,
} from "react-native";

type GameControlsProps = {
    currentTurn: "white" | "black";
    onRestart: () => void;
};

export function GameControls({
    currentTurn,
    onRestart,
}: GameControlsProps) {
    const handleRestart = () => {
        Alert.alert(
            "Restart Game",
            "Are you sure you want to restart this game?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Restart",
                    style: "destructive",
                    onPress: onRestart,
                },
            ],
        );
    };

    return (
        <View
            style={{
                width: "100%",
                paddingHorizontal: 16,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: "700",
                }}
            >
                {currentTurn === "white"
                    ? "White's turn"
                    : "Black's turn"}
            </Text>

            <Pressable
                onPress={handleRestart}
                style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor: "#E5E7EB",
                }}
            >
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: "700",
                    }}
                >
                    Restart
                </Text>
            </Pressable>
        </View>
    );
}