import React, { useState } from "react";
import { router } from "expo-router";
import {
    ImageBackground,
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useSession } from "@/features/auth/presentation/session/SessionProvider";

const COLORS = {
    background: "#050A12",
    gold: "#D9A441",
    goldLight: "#F4D18A",
    white: "#FFFFFF",
    muted: "#B7BBC5",
    border: "rgba(217, 164, 65, 0.5)",
};

type MenuItemProps = {
    title: string;
    subtitle: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    featured?: boolean;
};

function MenuItem({
    title,
    subtitle,
    icon,
    onPress,
    featured = false,
}: MenuItemProps) {
    return (
        <Pressable style={styles.gameCard} onPress={onPress}>
            <View style={styles.iconBox}>
                <Ionicons name={icon} size={27} color={COLORS.goldLight} />
            </View>

            <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{title}</Text>
                <Text style={styles.cardSubtitle}>{subtitle}</Text>
            </View>

            <View style={styles.arrowBox}>
                <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={COLORS.goldLight}
                />
            </View>
        </Pressable>
    );
}

export default function HomeScreen() {
    const { width, height } = useWindowDimensions();
    const { logout } = useSession();

    const [settingsVisible, setSettingsVisible] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const compact = height < 760;

    const handleTwoPlayerGame = () => {
        router.push({
            pathname: "/game",
            params: { mode: "local" },
        });
    };

    const handleComputerGame = () => {
        router.push("/computerDifficultylevel");
    };

    const handlePlayOnline = () => {
        router.push("/online-matchmaking");
    };

    const handleLogout = async () => {
        if (loggingOut) return;

        setLoggingOut(true);

        try {
            await logout();
            setSettingsVisible(false);
            router.replace("/(auth)/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <ImageBackground
            source={require("../../assets/images/chess-home-bg.png")}
            style={styles.background}
            resizeMode="cover"
        >
            <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.background}
            />

            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView
                        style={styles.scroll}
                        contentContainerStyle={[
                            styles.content,
                            {
                                paddingHorizontal: width < 360 ? 16 : 22,
                                paddingVertical: compact ? 12 : 20,
                            },
                        ]}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Top bar */}
                        <View style={styles.topBar}>
                            <View style={styles.brand}>
                                <View style={styles.statusDot} />
                                <Text style={styles.brandText}>
                                    CHESS ARENA
                                </Text>
                            </View>

                            <Pressable
                                onPress={() => setSettingsVisible(true)}
                                accessibilityRole="button"
                                accessibilityLabel="Open account settings"
                                hitSlop={10}
                                style={({ pressed }) => [
                                    styles.settingsButton,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <Ionicons
                                    name="settings-outline"
                                    size={23}
                                    color={COLORS.goldLight}
                                />
                            </Pressable>
                        </View>

                        {/* Heading */}
                        <View
                            style={[
                                styles.header,
                                { marginTop: compact ? 24 : 30 },
                            ]}
                        >
                            <Ionicons
                                name="trophy"
                                size={compact ? 26 : 30}
                                color={COLORS.gold}
                            />

                            <Text
                                style={[
                                    styles.heading,
                                    { fontSize: compact ? 44 : 52 },
                                ]}
                            >
                                Chess
                            </Text>

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <View style={styles.diamond} />
                                <View style={styles.dividerLine} />
                            </View>

                            <Text style={styles.headingSubtitle}>
                                Choose how you want to play
                            </Text>
                        </View>

                        {/* Game cards */}
                        <View
                            style={[
                                styles.gameList,
                                { marginTop: compact ? 28 : 38 },
                            ]}
                        >
                            <MenuItem
                                title="Two Players"
                                subtitle="Play locally with another player"
                                icon="people"
                                featured
                                onPress={handleTwoPlayerGame}
                            />

                            <MenuItem
                                title="Play With Computer"
                                subtitle="Challenge the computer"
                                icon="hardware-chip-outline"
                                onPress={handleComputerGame}
                            />

                            <MenuItem
                                title="Play Online"
                                subtitle="Find an opponent and play online"
                                icon="globe-outline"
                                onPress={handlePlayOnline}
                            />
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={16}
                                color={COLORS.gold}
                            />
                            <Text style={styles.footerText}>
                                THINK. PLAN. CONQUER.
                            </Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>

            {/* Settings menu */}
            <Modal
                visible={settingsVisible}
                transparent
                animationType="fade"
                statusBarTranslucent
                onRequestClose={() => setSettingsVisible(false)}
            >
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setSettingsVisible(false)}
                >
                    <Pressable
                        style={styles.accountMenu}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <View style={styles.accountHeader}>
                            <View style={styles.avatar}>
                                <Ionicons
                                    name="person"
                                    size={23}
                                    color={COLORS.goldLight}
                                />
                            </View>

                            <View style={styles.accountHeading}>
                                <Text style={styles.accountTitle}>
                                    Your account
                                </Text>
                                <Text style={styles.accountSubtitle}>
                                    Manage your session
                                </Text>
                            </View>

                            <Pressable
                                onPress={() => setSettingsVisible(false)}
                                hitSlop={8}
                                accessibilityLabel="Close settings"
                            >
                                <Ionicons
                                    name="close"
                                    size={23}
                                    color={COLORS.muted}
                                />
                            </Pressable>
                        </View>

                        <View style={styles.menuDivider} />

                        <Pressable
                            style={styles.accountRow}
                            onPress={() => setSettingsVisible(false)}
                        >
                            <Ionicons
                                name="person-outline"
                                size={21}
                                color={COLORS.goldLight}
                            />
                            <Text style={styles.accountRowText}>Username</Text>
                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={COLORS.muted}
                            />
                        </Pressable>

                        <View style={styles.menuDivider} />

                        <Pressable
                            onPress={() => {
                                setSettingsVisible(false);
                                router.push("/board-appearance");
                            }}
                            style={{
                                width: "100%",
                                height: 50,
                                flexDirection: "row",
                                alignItems: "center",
                                paddingHorizontal: 3,
                            }}
                            accessibilityRole="button"
                            accessibilityLabel="Board Appearance"
                        >
                            <Ionicons
                                name="color-palette-outline"
                                size={21}
                                color={COLORS.goldLight}
                                style={{ width: 28, flexShrink: 0 }}
                            />

                            <View style={{ flex: 1, minWidth: 0 }}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        color: COLORS.white,
                                        fontSize: 14,
                                        fontWeight: "600",
                                    }}
                                >
                                    Board Appearance
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={18}
                                color={COLORS.muted}
                                style={{ flexShrink: 0, marginLeft: 8 }}
                            />
                        </Pressable>

                        <View style={styles.menuDivider} />

                        <Pressable
                            style={styles.accountRow}
                            disabled={loggingOut}
                            onPress={handleLogout}
                        >
                            <Ionicons
                                name="log-out-outline"
                                size={21}
                                color="#FF8585"
                            />

                            <Text style={styles.logoutText}>
                                {loggingOut ? "Logging out..." : "Log out"}
                            </Text>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    overlay: {
        flex: 1,
        backgroundColor: "rgba(3, 6, 12, 0.76)",
    },

    safeArea: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    accountRow: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 3,
    },
    topBar: {
        width: "100%",
        height: 46,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    brand: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },

    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#79D99A",
    },

    brandText: {
        color: COLORS.goldLight,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 2,
    },

    settingsButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        backgroundColor: "rgba(7, 11, 18, 0.94)",
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    header: {
        width: "100%",
        alignItems: "center",
    },

    heading: {
        marginTop: 7,
        color: COLORS.goldLight,
        fontWeight: "900",
        letterSpacing: 1.5,
        textShadowColor: "rgba(217, 164, 65, 0.4)",
        textShadowRadius: 14,
        textShadowOffset: { width: 0, height: 2 },
    },

    divider: {
        width: "64%",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 12,
    },

    dividerLine: {
        height: 1,
        flex: 1,
        backgroundColor: COLORS.border,
    },

    diamond: {
        width: 7,
        height: 7,
        backgroundColor: COLORS.gold,
        transform: [{ rotate: "45deg" }],
    },

    headingSubtitle: {
        marginTop: 13,
        color: "#E0E1E5",
        fontSize: 14,
        textAlign: "center",
    },

    gameList: {
        width: "100%",
        gap: 14,
    },

    gameCard: {
        width: "100%",
        minHeight: 96,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 16,
        gap: 14,
        borderRadius: 18,
        backgroundColor: "#111823",
        borderWidth: 1,
        borderColor: "#343B47",
    },

    featuredCard: {
        backgroundColor: "#211C12",
        borderColor: COLORS.gold,
    },

    iconBox: {
        width: 52,
        height: 52,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        backgroundColor: "rgba(217, 164, 65, 0.12)",
        borderWidth: 1,
        borderColor: "rgba(217, 164, 65, 0.35)",
    },

    featuredIconBox: {
        backgroundColor: "rgba(217, 164, 65, 0.20)",
    },

    cardText: {
        flex: 1,
        minWidth: 0,
        justifyContent: "center",
    },

    cardTitle: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "800",
    },

    featuredTitle: {
        color: COLORS.goldLight,
    },

    cardSubtitle: {
        marginTop: 6,
        color: COLORS.muted,
        fontSize: 12,
        lineHeight: 17,
    },

    arrowBox: {
        width: 30,
        height: 30,
        flexShrink: 0,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "rgba(217, 164, 65, 0.30)",
    },

    pressed: {
        opacity: 0.78,
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

    footerText: {
        color: COLORS.goldLight,
        fontSize: 10,
        fontWeight: "800",
        letterSpacing: 1.8,
    },

    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.68)",
        alignItems: "flex-end",
        paddingTop: 85,
        paddingHorizontal: 18,
    },

    accountMenu: {
        width: 270,
        maxWidth: "100%",
        padding: 16,
        borderRadius: 20,
        backgroundColor: "#10151F",
        borderWidth: 1,
        borderColor: COLORS.border,
    },

    accountHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        paddingBottom: 14,
    },

    avatar: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        backgroundColor: "rgba(217, 164, 65, 0.15)",
    },

    accountHeading: {
        flex: 1,
    },

    accountTitle: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "800",
    },

    accountSubtitle: {
        marginTop: 3,
        color: COLORS.muted,
        fontSize: 11,
    },

    menuDivider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.10)",
    },

    accountRowText: {
        flex: 1,
        color: COLORS.white,
        fontSize: 14,
        fontWeight: "600",
    },

    logoutText: {
        flex: 1,
        color: "#FF8585",
        fontSize: 14,
        fontWeight: "700",
    },
});
