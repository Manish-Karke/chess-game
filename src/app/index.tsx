import { router } from "expo-router";
import React from "react";
import {
    Pressable,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const handleTwoPlayerGame = () => {
        router.push({
            pathname: "/game",
            params: {
                mode: "local",
            },
        });
    };

    const handleComputerGame = () => {
        router.push({
            pathname: "/game",
            params: {
                mode: "computer",
            },
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-neutral-900">
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    paddingHorizontal: 24,
                }}
            >
                <View
                    style={{
                        marginBottom: 40,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 40,
                            fontWeight: "900",
                            color: "#FFFFFF",
                        }}
                    >
                        Chess
                    </Text>

                    <Text
                        style={{
                            marginTop: 8,
                            fontSize: 16,
                            color: "#A3A3A3",
                        }}
                    >
                        Choose how you want to play
                    </Text>
                </View>

                <View
                    style={{
                        gap: 16,
                    }}
                >
                    <Pressable
                        onPress={handleTwoPlayerGame}
                        style={{
                            padding: 20,
                            borderRadius: 16,
                            backgroundColor: "#FFFFFF",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "800",
                                color: "#111827",
                            }}
                        >
                            Two Players
                        </Text>

                        <Text
                            style={{
                                marginTop: 6,
                                fontSize: 14,
                                color: "#6B7280",
                            }}
                        >
                            Play locally with another player
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handleComputerGame}
                        style={{
                            padding: 20,
                            borderRadius: 16,
                            backgroundColor: "#262626",
                            borderWidth: 1,
                            borderColor: "#404040",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "800",
                                color: "#FFFFFF",
                            }}
                        >
                            Play With Computer
                        </Text>

                        <Text
                            style={{
                                marginTop: 6,
                                fontSize: 14,
                                color: "#A3A3A3",
                            }}
                        >
                            Challenge the computer
                        </Text>
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
}