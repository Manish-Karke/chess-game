import React, { useState } from "react";
import {
    ActivityIndicator,
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
import { router } from "expo-router";
import { Controller } from "react-hook-form";

import { useRegisterViewModel } from "../viewModels/useRegisterViewModel";

const registerBackground = require("../../../../../assets/images/register.png");

const COLORS = {
    background: "#050A12",
    surface: "rgba(13, 22, 34, 0.96)",
    border: "#29394D",
    gold: "#FFD098",
    goldDark: "#E5A765",
    text: "#F7F3EE",
    muted: "#AAB8CC",
    error: "#FF9696",
};

export function RegisterScreen() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { form, submit, serverError, isSubmitting } = useRegisterViewModel({
        onRegistered: (email) => {
            router.push({
                pathname: "/(auth)/verify-email",
                params: { email },
            });
        },
    });

    const {
        control,
        formState: { errors },
    } = form;

    return (
        <View style={styles.screen}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.background}
            />

            {/* Background stays independent from the scrolling form. */}
            <ImageBackground
                source={registerBackground}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                accessible={false}
            />

            {/* Darken the top for readability; reveal artwork at the bottom. */}
            <LinearGradient
                colors={[
                    "rgba(5,10,18,0.88)",
                    "rgba(5,10,18,0.78)",
                    "rgba(5,10,18,0.48)",
                    "rgba(5,10,18,0.08)",
                ]}
                locations={[0, 0.43, 0.68, 1]}
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
                    {/* Back button */}
                    {/* <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                        accessibilityRole="button"
                        accessibilityLabel="Go back"
                        hitSlop={10}
                    >
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable> */}

                    {/* Heading */}
                    <View style={styles.heading}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>
                            Join a global community of chess players
                        </Text>
                    </View>

                    {/* Email */}
                    <View style={styles.field}>
                        <View
                            style={[
                                styles.inputBox,
                                errors.email && styles.inputError,
                            ]}
                        >
                            <Text style={styles.inputIcon}>✉</Text>

                            <Controller
                                control={control}
                                name="email"
                                render={({
                                    field: { value, onChange, onBlur },
                                }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email"
                                        placeholderTextColor="#7F8CA0"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="email"
                                        textContentType="emailAddress"
                                        editable={!isSubmitting}
                                        accessibilityLabel="Email"
                                        returnKeyType="next"
                                    />
                                )}
                            />
                        </View>

                        {errors.email && (
                            <Text style={styles.error}>
                                {errors.email.message}
                            </Text>
                        )}
                    </View>

                    {/* Username */}
                    <View style={styles.field}>
                        <View
                            style={[
                                styles.inputBox,
                                errors.username && styles.inputError,
                            ]}
                        >
                            <Text style={styles.inputIcon}>♙</Text>

                            <Controller
                                control={control}
                                name="username"
                                render={({
                                    field: { value, onChange, onBlur },
                                }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Username"
                                        placeholderTextColor="#7F8CA0"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="username"
                                        editable={!isSubmitting}
                                        accessibilityLabel="Username"
                                        returnKeyType="next"
                                    />
                                )}
                            />
                        </View>

                        <Text style={styles.helper}>
                            This will be your public name
                        </Text>

                        {errors.username && (
                            <Text style={styles.error}>
                                {errors.username.message}
                            </Text>
                        )}
                    </View>

                    {/* Password */}
                    <View style={styles.field}>
                        <View
                            style={[
                                styles.inputBox,
                                errors.password && styles.inputError,
                            ]}
                        >
                            <Text style={styles.inputIcon}>♙</Text>

                            <Controller
                                control={control}
                                name="password"
                                render={({
                                    field: { value, onChange, onBlur },
                                }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor="#7F8CA0"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="new-password"
                                        textContentType="newPassword"
                                        editable={!isSubmitting}
                                        accessibilityLabel="Password"
                                        returnKeyType="next"
                                    />
                                )}
                            />

                            <Pressable
                                onPress={() =>
                                    setShowPassword((visible) => !visible)
                                }
                                hitSlop={10}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                <Text style={styles.visibility}>
                                    {showPassword ? "Hide" : "Show"}
                                </Text>
                            </Pressable>
                        </View>

                        {errors.password && (
                            <Text style={styles.error}>
                                {errors.password.message}
                            </Text>
                        )}
                    </View>

                    {/* Confirm password */}
                    <View style={styles.field}>
                        <View
                            style={[
                                styles.inputBox,
                                errors.confirmPassword && styles.inputError,
                            ]}
                        >
                            <Text style={styles.inputIcon}>♙</Text>

                            <Controller
                                control={control}
                                name="confirmPassword"
                                render={({
                                    field: { value, onChange, onBlur },
                                }) => (
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm Password"
                                        placeholderTextColor="#7F8CA0"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        secureTextEntry={!showConfirmPassword}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="new-password"
                                        textContentType="newPassword"
                                        editable={!isSubmitting}
                                        accessibilityLabel="Confirm password"
                                        onSubmitEditing={() => submit()}
                                        returnKeyType="go"
                                    />
                                )}
                            />

                            <Pressable
                                onPress={() =>
                                    setShowConfirmPassword(
                                        (visible) => !visible,
                                    )
                                }
                                hitSlop={10}
                                accessibilityRole="button"
                                accessibilityLabel={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                            >
                                <Text style={styles.visibility}>
                                    {showConfirmPassword ? "Hide" : "Show"}
                                </Text>
                            </Pressable>
                        </View>

                        {errors.confirmPassword && (
                            <Text style={styles.error}>
                                {errors.confirmPassword.message}
                            </Text>
                        )}
                    </View>

                    {/* Backend error */}
                    {serverError ? (
                        <View style={styles.errorBox}>
                            <Text style={styles.serverError}>
                                {serverError}
                            </Text>
                        </View>
                    ) : null}

                    {/* Create account */}
                    <Pressable
                        onPress={submit}
                        disabled={isSubmitting}
                        accessibilityRole="button"
                        style={({ pressed }) => [
                            styles.button,
                            pressed && !isSubmitting && styles.buttonPressed,
                            isSubmitting && styles.buttonDisabled,
                        ]}
                    >
                        <LinearGradient
                            colors={[COLORS.gold, COLORS.goldDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.buttonGradient}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color="#17110A" />
                            ) : (
                                <Text style={styles.buttonText}>
                                    Create Account
                                </Text>
                            )}
                        </LinearGradient>
                    </Pressable>

                    {/* Social sign-up divider */}
                    <View style={styles.dividerRow}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or sign up with</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Add provider buttons here once social auth is configured. */}

                    {/* Login link */}
                    <View style={styles.loginRow}>
                        <Text style={styles.muted}>
                            Already have an account?{" "}
                        </Text>

                        <Pressable
                            onPress={() => router.replace("/(auth)/login")}
                            accessibilityRole="link"
                        >
                            <Text style={styles.goldLink}>Log In</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        marginTop:4,
        paddingTop:9,
        flex: 1,
        backgroundColor: COLORS.background,
        overflow: "hidden",
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 36,
        paddingHorizontal: 22,
        paddingBottom: 28,
    },
    backButton: {
        width: 42,
        height: 42,
        justifyContent: "center",
        marginBottom: 12,
    },
    backIcon: {
        color: "#FFFFFF",
        fontSize: 39,
        lineHeight: 42,
    },
    heading: {
        alignItems: "center",
        marginBottom: 30,
    },
    title: {
        color: COLORS.text,
        fontSize: 31,
        fontWeight: "700",
        letterSpacing: -0.6,
        textAlign: "center",
    },
    subtitle: {
        color: COLORS.muted,
        fontSize: 14,
        textAlign: "center",
        marginTop: 8,
    },
    field: {
        marginBottom: 16,
    },
    inputBox: {
        minHeight: 60,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(125, 157, 194, 0.25)",
        borderRadius: 17,
        backgroundColor: "rgba(15, 27, 42, 0.58)",
        paddingHorizontal: 15,
    },
    inputError: {
        borderColor: COLORS.error,
    },
    inputIcon: {
        color: "#C0CDE0",
        fontSize: 21,
        width: 38,
    },
    //   input: {
    //     flex: 1,
    //     minWidth: 0,
    //     color: COLORS.text,
    //     fontSize: 15,
    //     paddingVertical: 15,
    //   },
    input: {
        flex: 1,
        minWidth: 0,
        color: "#F7F3EE",
        fontSize: 15,
        paddingVertical: 15,
    },
    visibility: {
        color: "#C0CDE0",
        fontSize: 12,
        fontWeight: "600",
        paddingVertical: 10,
        paddingLeft: 8,
    },
    helper: {
        color: COLORS.muted,
        fontSize: 12,
        marginTop: 8,
        marginLeft: 53,
    },
    error: {
        color: COLORS.error,
        fontSize: 12,
        marginTop: 6,
        marginLeft: 4,
    },
    errorBox: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: "#351B20",
        borderWidth: 1,
        borderColor: "#71343A",
    },
    serverError: {
        color: "#FFD2CE",
        fontSize: 13,
    },
    button: {
        borderRadius: 17,
        overflow: "hidden",
        marginTop: 5,
    },
    buttonGradient: {
        minHeight: 61,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 208, 152, 0.92)",
    },
    buttonPressed: {
        opacity: 0.86,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#17110A",
        fontSize: 17,
        fontWeight: "800",
    },
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 27,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        color: COLORS.muted,
        fontSize: 12,
    },
    loginRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        marginTop: 27,
    },
    muted: {
        color: COLORS.muted,
        fontSize: 14,
    },
    goldLink: {
        color: "#FFC66F",
        fontSize: 14,
        fontWeight: "700",
    },
});
