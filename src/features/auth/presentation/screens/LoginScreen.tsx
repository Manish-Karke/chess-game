
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
import { Link, router } from "expo-router";
import { Controller } from "react-hook-form";

import { useLoginViewModel } from "../viewModels/useLoginViewModel";

const loginBackground = require("../../../../../assets/images/login.png");

const COLORS = {
  background: "#050A12",
  text: "#F7F3EE",
  muted: "#AAB8CC",
  gold: "#FFD098",
  goldDark: "#E5A765",
  border: "rgba(125, 157, 194, 0.25)",
  error: "#FF9696",
};

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const { form, submit, serverError, isSubmitting } =
    useLoginViewModel({
      onLoggedIn: () => router.replace("/home"),
    });

  const {
    control,
    formState: { errors },
  } = form;

  const needsVerification =
    serverError?.toLowerCase().includes("verify your email") ?? false;

  return (
    <View style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      {/* Background artwork */}
      <ImageBackground
        source={loginBackground}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
        accessible={false}
      />

      {/* Transparent overlay keeps the artwork visible */}
      <LinearGradient
        colors={[
          "rgba(5,10,18,0.90)",
          "rgba(5,10,18,0.82)",
          "rgba(5,10,18,0.58)",
          "rgba(5,10,18,0.16)",
        ]}
        locations={[0, 0.43, 0.70, 1]}
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
          {/* Back navigation */}
          <Pressable
           onPress={() => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace("/(auth)/register");
  }
}}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={10}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          {/* Brand mark */}
          <View style={styles.logo}>
            <Text style={styles.chessIcon}>♞</Text>
          </View>

          {/* Heading */}
          <View style={styles.heading}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Your next move starts here.
            </Text>
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email address</Text>

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
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="you@example.com"
                    placeholderTextColor="#8997AA"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    editable={!isSubmitting}
                    accessibilityLabel="Email address"
                    returnKeyType="next"
                  />
                )}
              />
            </View>

            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
          </View>

          {/* Password */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>

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
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#8997AA"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    textContentType="password"
                    editable={!isSubmitting}
                    accessibilityLabel="Password"
                    onSubmitEditing={() => submit()}
                    returnKeyType="go"
                  />
                )}
              />

              <Pressable
                onPress={() => setShowPassword((visible) => !visible)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                <Text style={styles.visibility}>
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>

            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </View>

          {/* Email verification shortcut */}
          <Pressable
            onPress={() => router.push("/(auth)/verify-email")}
            style={styles.verifyLinkContainer}
            accessibilityRole="link"
          >
            <Text style={styles.verifyLink}>
              Need to verify your email?
            </Text>
          </Pressable>

          {/* Server-side errors */}
          {serverError ? (
            <View style={styles.errorBox}>
              <Text style={styles.serverError}>{serverError}</Text>

              {needsVerification && (
                <Pressable
                  onPress={() => router.push("/(auth)/verify-email")}
                  accessibilityRole="link"
                >
                  <Text style={styles.verifyAction}>
                    Go to email verification
                  </Text>
                </Pressable>
              )}
            </View>
          ) : null}

          {/* Login action */}
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
              colors={[
                "rgba(255,213,157,0.96)",
                "rgba(229,167,101,0.94)",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#17110A" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </LinearGradient>
          </Pressable>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Ready for your next move?</Text>
            <View style={styles.divider} />
          </View>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.muted}>Don't have an account? </Text>

            <Link href="/(auth)/register" asChild>
              <Pressable accessibilityRole="link">
                <Text style={styles.goldLink}>Register</Text>
              </Pressable>
            </Link>
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
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 30,
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
  logo: {
    width: 66,
    height: 66,
    borderRadius: 21,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(20,31,46,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,208,152,0.40)",
    marginBottom: 18,
  },
  chessIcon: {
    color: COLORS.gold,
    fontSize: 40,
  },
  heading: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.6,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: "#E6EAF0",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 9,
    marginLeft: 3,
  },
  inputBox: {
    minHeight: 59,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 17,
    backgroundColor: "rgba(15,27,42,0.58)",
    paddingHorizontal: 15,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    width: 36,
    color: "#C0CDE0",
    fontSize: 20,
  },
  input: {
    flex: 1,
    minWidth: 0,
    color: COLORS.text,
    fontSize: 15,
    paddingVertical: 15,
  },
  visibility: {
    color: "#D6DFEA",
    fontSize: 12,
    fontWeight: "600",
    paddingVertical: 10,
    paddingLeft: 8,
  },
  error: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  verifyLinkContainer: {
    alignSelf: "flex-end",
    marginTop: -5,
    marginBottom: 18,
    paddingVertical: 4,
  },
  verifyLink: {
    color: "#E9C99E",
    fontSize: 13,
    fontWeight: "600",
  },
  errorBox: {
    backgroundColor: "rgba(75,25,32,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,150,150,0.28)",
    borderRadius: 12,
    padding: 13,
    marginBottom: 14,
  },
  serverError: {
    color: "#FFD2CE",
    fontSize: 13,
    lineHeight: 19,
  },
  verifyAction: {
    color: "#FFD098",
    fontWeight: "700",
    marginTop: 9,
  },
  button: {
    borderRadius: 17,
    overflow: "hidden",
    marginTop: 4,
  },
  buttonGradient: {
    minHeight: 59,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#17110A",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 28,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(125,157,194,0.25)",
  },
  dividerText: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 22,
  },
  muted: {
    color: COLORS.muted,
    fontSize: 14,
  },
  goldLink: {
    color: "#FFC66F",
    fontSize: 14,
    fontWeight: "800",
  },
});
