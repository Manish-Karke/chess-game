import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="register"
        options={{ title: "Create account" }}
      />
      <Stack.Screen
        name="verify-email"
        options={{ title: "Verify email" }}
      />
      <Stack.Screen
        name="login"
        options={{ title: "Login" }}
      />
    </Stack>
  );
}