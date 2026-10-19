import React from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { ComputerDifficulty } from "@/features/chess/domain/entities/ChessPiece";

const COLORS = {
    background: "#080D16",
    surface: "#121923",
    surfaceFeatured: "#211C13",
    gold: "#D9A441",
    goldLight: "#F2CC83",
    white: "#FFFFFF",
    muted: "#A9B0BD",
    border: "#343B47",
};

type DifficultyOption = {
    title: string;
    description: string;
    difficulty: ComputerDifficulty;
    icon: keyof typeof Ionicons.glyphMap;
    level: number;
};

const DIFFICULTIES: DifficultyOption[] = [
    {
        title: "Easy",
        description: "Relaxed games. Perfect for beginners.",
        difficulty: "easy",
        icon: "leaf-outline",
        level: 1,
    },
    {
        title: "Medium",
        description: "Think ahead and improve your strategy.",
        difficulty: "medium",
        icon: "bulb-outline",
        level: 2,
    },
    {
        title: "Hard",
        description: "A tough opponent. Every move matters.",
        difficulty: "hard",
        icon: "flash-outline",
        level: 3,
    },
];
const { width, height } = useWindowDimensions();
const compact = height < 760;
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
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    {
                        paddingHorizontal: width < 360 ? 16 : 22,
                        paddingVertical: compact ? 12 : 20,
                    },
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        onPress={() => router.back()}
                        hitSlop={10}
                        style={({ pressed }) => [
                            styles.backButton,
                            pressed && styles.pressed,
                        ]}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={22}
                            color={COLORS.goldLight}
                        />
                    </Pressable>

                    <View style={styles.brand}>
                        <Text style={styles.brandTitle}>CHESS ARENA</Text>
                        <Text style={styles.brandSubtitle}>
                            PLAY AGAINST COMPUTER
                        </Text>
                    </View>

                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.hero}>
                    <View style={styles.heroIcon}>
                        <Ionicons
                            name="trophy-outline"
                            size={30}
                            color={COLORS.gold}
                        />
                    </View>

                    <Text style={styles.heading}>Choose Difficulty</Text>

                    <Text style={styles.subtitle}>
                        Choose your opponent. Test your strategy.
                    </Text>
                </View>

                <View style={styles.difficultyList}>
                    {DIFFICULTIES.map((item) => (
                        <DifficultyCard
                            key={item.difficulty}
                            item={item}
                            onPress={() =>
                                handleSelectDifficulty(item.difficulty)
                            }
                        />
                    ))}
                </View>

                <View style={styles.footer}>
                    <Ionicons
                        name="shield-checkmark-outline"
                        size={17}
                        color={COLORS.gold}
                    />
                    <Text style={styles.footerText}>THINK. PLAN. CONQUER.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

type DifficultyCardProps = {
    item: DifficultyOption;
    onPress: () => void;
};

function DifficultyCard({ item, onPress }: DifficultyCardProps) {
    const featured = item.difficulty === "medium";

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${item.title} difficulty. ${item.description}`}
            style={({ pressed }) => [
                styles.card,
                featured && styles.featuredCard,
                pressed && styles.pressed,
            ]}
        >
            <View style={styles.cardRow}>
                <View style={styles.iconBox}>
                    <Ionicons
                        name={item.icon}
                        size={27}
                        color={COLORS.goldLight}
                    />
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>
                        {item.description}
                    </Text>
                </View>

                <Ionicons
                    name="chevron-forward"
                    size={21}
                    color={COLORS.goldLight}
                />
            </View>

            <View style={styles.strengthTrack}>
                {[1, 2, 3].map((step) => (
                    <View
                        key={step}
                        style={[
                            styles.strengthSegment,
                            step <= item.level && styles.strengthActive,
                        ]}
                    />
                ))}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },

    header: {
        width: "100%",
        height: 46,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    hero: {
        width: "100%",
        alignItems: "center",
        marginTop: compact ? 24 : 30,
    },

    difficultyList: {
        width: "100%",
        gap: 14,
        marginTop: compact ? 28 : 38,
    },

    card: {
        width: "100%",
        minHeight: 96,
        paddingHorizontal: 14,
        paddingVertical: 16,
        borderRadius: 18,
        borderWidth: 1,
        justifyContent: "center",
    },

    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        marginTop: 26,
        paddingTop: 8,
        paddingBottom: 8,
    },

    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    brand: {
        flex: 1,
        gap: 4,
    },
    brandTitle: {
        color: COLORS.goldLight,
        fontSize: 12,
        fontWeight: "900",
        letterSpacing: 2,
    },
    brandSubtitle: {
        color: COLORS.muted,
        fontSize: 9,
        fontWeight: "600",
        letterSpacing: 1.2,
    },
    headerSpacer: {
        width: 10,
    },

    heroIcon: {
        width: 62,
        height: 62,
        borderRadius: 20,
        backgroundColor: "#211C13",
        borderWidth: 1,
        borderColor: "#594522",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    heading: {
        color: COLORS.goldLight,
        fontSize: 29,
        fontWeight: "900",
        textAlign: "center",
        letterSpacing: -0.6,
    },
    subtitle: {
        color: COLORS.muted,
        fontSize: 14,
        textAlign: "center",
        lineHeight: 21,
        marginTop: 9,
    },

    featuredCard: {
        backgroundColor: COLORS.surfaceFeatured,
        borderColor: "#8C6A34",
    },
    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 13,
    },
    iconBox: {
        width: 49,
        height: 49,
        borderRadius: 15,
        backgroundColor: "#302719",
        borderWidth: 1,
        borderColor: "#594522",
        alignItems: "center",
        justifyContent: "center",
    },
    cardContent: {
        flex: 1,
        gap: 5,
    },
    cardTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: "800",
    },
    cardDescription: {
        color: COLORS.muted,
        fontSize: 12,
        lineHeight: 18,
    },
    strengthTrack: {
        flexDirection: "row",
        gap: 5,
    },
    strengthSegment: {
        height: 4,
        flex: 1,
        borderRadius: 4,
        backgroundColor: COLORS.border,
    },
    strengthActive: {
        backgroundColor: COLORS.gold,
    },

    footerText: {
        color: COLORS.goldLight,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 2,
    },
    pressed: {
        opacity: 0.78,
        transform: [{ scale: 0.985 }],
    },
});
