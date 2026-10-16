
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { verifyEmailUseCase } from
  "../../features/auth/di/authFactory";

export default function VerifyEmailScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!email) {
      Alert.alert("Error", "Email address is missing.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      Alert.alert(
        "Invalid code",
        "Enter the six-digit code sent to your email."
      );
      return;
    }

    try {
      setLoading(true);

      await verifyEmailUseCase.execute({
        email,
        code,
      });

      Alert.alert("Success", "Your email has been verified.");

      router.replace("/(auth)/login");
    } catch (error) {
      Alert.alert(
        "Verification failed",
        error instanceof Error
          ? error.message
          : "Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>

      <Text style={styles.description}>
        Enter the six-digit verification code sent to:
      </Text>

      <Text style={styles.email}>{email ?? "Email unavailable"}</Text>

      <TextInput
        value={code}
        onChangeText={(value) =>
          setCode(value.replace(/\D/g, "").slice(0, 6))
        }
        placeholder="000000"
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
        style={styles.input}
        accessibilityLabel="Six-digit verification code"
      />

      <Pressable
        onPress={handleVerify}
        disabled={loading}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Verify Email</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F0EFD5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#171717",
  },
  description: {
    fontSize: 16,
    color: "#555555",
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: "center",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
