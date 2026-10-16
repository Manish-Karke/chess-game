import React, { useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { router, Link } from "expo-router";
import { Controller } from "react-hook-form";

import { useLoginViewModel } from "../../features/auth/presentation/viewModels/useLoginViewModel";

export default function LoginScreen() {
    const [showPassword, setShowPassword] = useState(false);

    const { form, submit, serverError, isSubmitting } = useLoginViewModel({
        onLoggedIn: () => router.replace("/home"),
    });

    const {
        control,
        formState: { errors },
    } = form;

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.logo}>
                    <Text style={styles.chessIcon}>♞</Text>
                </View>

                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Your next move starts here.</Text>

                <Text style={styles.label}>Email address</Text>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { value, onChange, onBlur } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                errors.email && styles.inputError,
                            ]}
                            placeholder="you@example.com"
                            placeholderTextColor="#888888"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isSubmitting}
                            accessibilityLabel="Email address"
                        />
                    )}
                />

                {errors.email && (
                    <Text style={styles.error}>{errors.email.message}</Text>
                )}

                <Text style={styles.label}>Password</Text>

                <View
                    style={[
                        styles.passwordContainer,
                        errors.password && styles.inputError,
                    ]}
                >
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Enter your password"
                                placeholderTextColor="#888888"
                                value={value}
                                onChangeText={onChange}
                                onBlur={onBlur}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isSubmitting}
                                accessibilityLabel="Password"
                                onSubmitEditing={() => submit()}
                                returnKeyType="go"
                            />
                        )}
                    />

                    <Pressable
                        onPress={() => setShowPassword((current) => !current)}
                        accessibilityRole="button"
                        accessibilityLabel={
                            showPassword ? "Hide password" : "Show password"
                        }
                    >
                        <Text style={styles.showPassword}>
                            {showPassword ? "Hide" : "Show"}
                        </Text>
                    </Pressable>
                </View>

                {errors.password && (
                    <Text style={styles.error}>{errors.password.message}</Text>
                )}

                <Pressable
                    onPress={() => {
                        router.push("/(auth)/verify-email");
                    }}
                    style={styles.forgotLink}
                >
                    <Text style={styles.linkText}>
                        Need to verify your email?
                    </Text>
                </Pressable>

                {serverError && (
                    <View style={styles.errorBox}>
                        <Text style={styles.errorBoxText}>{serverError}</Text>

                        {serverError
                            .toLowerCase()
                            .includes("verify your email") && (
                            <Pressable
                                onPress={() =>
                                    router.push("/(auth)/verify-email")
                                }
                            >
                                <Text style={styles.verifyLink}>
                                    Go to email verification
                                </Text>
                            </Pressable>
                        )}
                    </View>
                )}

                <Pressable
                    onPress={submit}
                    disabled={isSubmitting}
                    style={[
                        styles.loginButton,
                        isSubmitting && styles.disabledButton,
                    ]}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.loginButtonText}>Log In</Text>
                    )}
                </Pressable>

                <View style={styles.registerRow}>
                    <Text style={styles.registerText}>
                        Don't have an account?{" "}
                    </Text>

                    <Link href="/(auth)/register" asChild>
                        <Pressable>
                            <Text style={styles.registerLink}>Register</Text>
                        </Pressable>
                    </Link>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#F0EFD5",
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 26,
        paddingVertical: 36,
    },
    logo: {
        width: 72,
        height: 72,
        borderRadius: 22,
        backgroundColor: "#252525",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 22,
    },
    chessIcon: {
        color: "#FFFFFF",
        fontSize: 42,
    },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#202020",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 15,
        color: "#666666",
        textAlign: "center",
        marginTop: 8,
        marginBottom: 34,
    },
    label: {
        color: "#303030",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 8,
        marginTop: 16,
    },
    input: {
        height: 54,
        borderWidth: 1,
        borderColor: "#D0D0C0",
        borderRadius: 13,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#202020",
    },
    inputError: {
        borderColor: "#C0392B",
    },
    passwordContainer: {
        height: 54,
        borderWidth: 1,
        borderColor: "#D0D0C0",
        borderRadius: 13,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
    },
    passwordInput: {
        flex: 1,
        height: "100%",
        color: "#202020",
        fontSize: 16,
    },
    showPassword: {
        color: "#343434",
        fontWeight: "600",
        padding: 8,
    },
    error: {
        color: "#B42318",
        marginTop: 6,
        fontSize: 13,
    },
    forgotLink: {
        alignSelf: "flex-end",
        marginTop: 14,
    },
    linkText: {
        color: "#464646",
        fontSize: 13,
        fontWeight: "600",
    },
    errorBox: {
        marginTop: 18,
        backgroundColor: "#FCE8E6",
        borderRadius: 10,
        padding: 12,
    },
    errorBoxText: {
        color: "#B42318",
        fontSize: 14,
    },
    verifyLink: {
        marginTop: 8,
        color: "#8D2118",
        fontWeight: "700",
    },
    loginButton: {
        backgroundColor: "#252525",
        height: 56,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 26,
    },
    disabledButton: {
        opacity: 0.65,
    },
    loginButtonText: {
        color: "#FFFFFF",
        fontSize: 17,
        fontWeight: "700",
    },
    registerRow: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 26,
    },
    registerText: {
        color: "#666666",
        fontSize: 14,
    },
    registerLink: {
        color: "#202020",
        fontWeight: "800",
        fontSize: 14,
    },
});
