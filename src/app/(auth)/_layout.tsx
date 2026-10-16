
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: "#050A12",
        },
      }}
    >
      <Stack.Screen
        name="register"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="login"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="verify-email"
        options={{ animation: "fade" }}
      />
    </Stack>
  );
}
