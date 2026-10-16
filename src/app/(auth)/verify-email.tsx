import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

import { verifyEmailUseCase } from "../../features/auth/di/authFactory";

const verifyBackground = require("../../../assets/images/register.png");

const COLORS = {
    background: "#050A12",
    gold: "#FFD098",
    goldDark: "#E5A765",
    text: "#F7F3EE",
    muted: "#AAB8CC",
    error: "#FF9696",
};

export default function VerifyEmailScreen() {
    const params = useLocalSearchParams<{ email?: string | string[] }>();
    const email = Array.isArray(params.email) ? params.email[0] : params.email;

    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleVerify() {
        if (!email) {
            Alert.alert("Email missing", "Please register again to continue.");
            return;
        }

        if (!/^\d{6}$/.test(code)) {
            Alert.alert(
                "Invalid code",
                "Enter the six-digit verification code sent to your email.",
            );
            return;
        }

        try {
            setLoading(true);

            await verifyEmailUseCase.execute({
                email,
                code,
            });

            Alert.alert(
                "Email verified",
                "Your account is ready. You can now log in.",
                [
                    {
                        text: "Continue",
                        onPress: () => router.replace("/(auth)/login"),
                    },
                ],
            );
        } catch (error) {
            Alert.alert(
                "Verification failed",
                error instanceof Error
                    ? error.message
                    : "Unable to verify your email. Please try again.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.screen}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.background}
            />

            <ImageBackground
                source={verifyBackground}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                accessible={false}
            />

            <LinearGradient
                colors={[
                    "rgba(5,10,18,0.94)",
                    "rgba(5,10,18,0.87)",
                    "rgba(5,10,18,0.70)",
                    "rgba(5,10,18,0.45)",
                ]}
                locations={[0, 0.4, 0.72, 1]}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            />

            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <View style={styles.iconCircle}>
                            <Text style={styles.mailIcon}>✉</Text>
                        </View>

                        <Text style={styles.eyebrow}>ONE LAST STEP</Text>

                        <Text style={styles.title}>Verify Your Email</Text>

                        <Text style={styles.description}>
                            We've sent a six-digit verification code to
                        </Text>

                        <Text style={styles.email}>
                            {email ?? "Email unavailable"}
                        </Text>

                        <View style={styles.codeContainer}>
                            <TextInput
                                value={code}
                                onChangeText={(value) =>
                                    setCode(
                                        value.replace(/\D/g, "").slice(0, 6),
                                    )
                                }
                                placeholder="000000"
                                placeholderTextColor="#66758A"
                                keyboardType="number-pad"
                                maxLength={6}
                                editable={!loading}
                                style={styles.codeInput}
                                accessibilityLabel="Six-digit verification code"
                                textContentType="oneTimeCode"
                                autoComplete="one-time-code"
                                autoFocus={false}
                                returnKeyType="done"
                                onSubmitEditing={handleVerify}
                            />
                        </View>

                        <Text style={styles.helper}>
                            Enter the code exactly as it appears in your email.
                        </Text>

                        <Pressable
                            onPress={handleVerify}
                            disabled={loading}
                            accessibilityRole="button"
                            style={({ pressed }) => [
                                styles.button,
                                pressed && !loading && styles.buttonPressed,
                                loading && styles.buttonDisabled,
                            ]}
                        >
                            <LinearGradient
                                colors={[COLORS.gold, COLORS.goldDark]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.buttonGradient}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#17110A" />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Verify Email
                                    </Text>
                                )}
                            </LinearGradient>
                        </Pressable>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Already verified?
                            </Text>

                            <Pressable
                                onPress={() => router.replace("/(auth)/login")}
                                accessibilityRole="link"
                                disabled={loading}
                            >
                                <Text style={styles.loginLink}>Log In</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: COLORS.background,
        overflow: "hidden",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    content: {
        width: "100%",
        maxWidth: 440,
        alignSelf: "center",
        alignItems: "center",
    },
    iconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,208,152,0.10)",
        borderWidth: 1,
        borderColor: "rgba(255,208,152,0.35)",
        marginBottom: 25,
    },
    mailIcon: {
        color: COLORS.gold,
        fontSize: 34,
    },
    eyebrow: {
        color: COLORS.gold,
        fontSize: 11,
        fontWeight: "800",
        letterSpacing: 3,
        marginBottom: 12,
    },
    title: {
        color: COLORS.text,
        fontSize: 30,
        fontWeight: "800",
        textAlign: "center",
        letterSpacing: -0.5,
    },
    description: {
        color: COLORS.muted,
        fontSize: 14,
        lineHeight: 22,
        textAlign: "center",
        marginTop: 16,
    },
    email: {
        color: COLORS.gold,
        fontSize: 14,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 7,
        marginBottom: 30,
    },
    codeContainer: {
        width: "100%",
        borderRadius: 17,
        borderWidth: 1,
        borderColor: "rgba(255,208,152,0.30)",
        backgroundColor: "rgba(15,27,42,0.68)",
        overflow: "hidden",
    },
    codeInput: {
        color: COLORS.text,
        fontSize: 28,
        fontWeight: "700",
        letterSpacing: 10,
        textAlign: "center",
        paddingHorizontal: 16,
        paddingVertical: 18,
        minHeight: 70,
    },
    helper: {
        color: COLORS.muted,
        fontSize: 12,
        lineHeight: 18,
        textAlign: "center",
        marginTop: 12,
        marginBottom: 25,
    },
    button: {
        width: "100%",
        borderRadius: 17,
        overflow: "hidden",
    },
    buttonGradient: {
        minHeight: 60,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#17110A",
        fontSize: 16,
        fontWeight: "800",
    },
    buttonPressed: {
        opacity: 0.86,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        marginTop: 28,
    },
    footerText: {
        color: COLORS.muted,
        fontSize: 14,
    },
    loginLink: {
        color: COLORS.gold,
        fontSize: 14,
        fontWeight: "800",
    },
});
