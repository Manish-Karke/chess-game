
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your Chess account</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/")}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#171717",
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 24,
    fontSize: 16,
    color: "#666666",
  },
  button: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#252525",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
