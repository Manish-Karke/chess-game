import { ComputerDifficulty } from "@/features/chess/domain/entities/ChessPiece";
import { router } from "expo-router";

import React from "react";

import { Pressable, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function ComputerDifficultyScreen() {
    const handleSelectDifficulty = (difficulty: ComputerDifficulty) => {
        router.push({
            pathname: "/game",

            params: {
                mode: "computer",
                difficulty,
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
                <Text
                    style={{
                        fontSize: 32,
                        fontWeight: "900",
                        color: "#FFFFFF",
                    }}
                >
                    Choose Difficulty
                </Text>

                <Text
                    style={{
                        marginTop: 8,
                        marginBottom: 32,
                        fontSize: 15,
                        color: "#A3A3A3",
                    }}
                >
                    Select how strong the computer should play
                </Text>

                <View
                    style={{
                        gap: 14,
                    }}
                >
                    <DifficultyCard
                        title="Easy"
                        description="Casual opponent with simple decisions"
                        onPress={() => handleSelectDifficulty("easy")}
                    />

                    <DifficultyCard
                        title="Medium"
                        description="Plays strategically and values good positions"
                        onPress={() => handleSelectDifficulty("medium")}
                    />

                    <DifficultyCard
                        title="Hard"
                        description="Looks ahead and plays aggressively to win"
                        onPress={() => handleSelectDifficulty("hard")}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

type DifficultyCardProps = {
    title: string;
    description: string;
    onPress: () => void;
};

function DifficultyCard({ title, description, onPress }: DifficultyCardProps) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                padding: 20,

                backgroundColor: "#262626",

                borderRadius: 16,

                borderWidth: 1,
                borderColor: "#404040",
            }}
        >
            <Text
                style={{
                    color: "#FFFFFF",
                    fontWeight: "800",
                    fontSize: 20,
                }}
            >
                {title}
            </Text>

            <Text
                style={{
                    marginTop: 6,

                    color: "#A3A3A3",

                    fontSize: 14,
                    lineHeight: 20,
                }}
            >
                {description}
            </Text>
        </Pressable>
    );
}
