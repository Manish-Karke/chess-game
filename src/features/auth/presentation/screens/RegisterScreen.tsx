import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Controller } from "react-hook-form";

import { useRegisterViewModel } from "../viewModels/useRegisterViewModel";

export function RegisterScreen() {
//   const {
//     form,
//     submit,
//     serverError,
//     isSubmitting,
//   } = useRegisterViewModel();
const {
  form,
  submit,
  serverError,
  isSubmitting,
} = useRegisterViewModel({
  onRegistered: (email) => {
    router.push({
      pathname: "/(auth)/verify-email",
      params: { email },
    });
  },
});
  const { control, formState: { errors } } = form;

//   const handleRegister = async () => {
//     const result = await submit();

//     if (result) {
//       router.push({
//         pathname: "/(auth)/verify-email",
//         params: { email: result.user.email },
//       });
//     }
//   };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>
        Create an account to play chess online.
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
            />
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="chess_player"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.username && (
              <Text style={styles.error}>{errors.username.message}</Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 12 characters"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoComplete="new-password"
            />
            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
          </>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password again"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <Text style={styles.error}>
                {errors.confirmPassword.message}
              </Text>
            )}
          </>
        )}
      />

      {serverError && (
        <Text accessibilityRole="alert" style={styles.error}>
          {serverError}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        disabled={isSubmitting}
        onPress={submit}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
          isSubmitting && styles.buttonDisabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Create account</Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => router.push("/(auth)/login")}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>
          Already have an account? Log in
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#EEEED2",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#202020",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 15,
    color: "#606060",
  },
  label: {
    marginBottom: 6,
    marginTop: 14,
    fontSize: 14,
    fontWeight: "600",
    color: "#202020",
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C7C7B5",
    backgroundColor: "#FFFFFF",
    color: "#202020",
  },
  error: {
    marginTop: 5,
    color: "#B42318",
    fontSize: 13,
  },
  button: {
    minHeight: 52,
    marginTop: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#262626",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  linkButton: {
    alignItems: "center",
    paddingVertical: 18,
  },
  linkText: {
    color: "#262626",
    fontWeight: "600",
  },
});