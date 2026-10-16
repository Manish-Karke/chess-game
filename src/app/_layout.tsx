
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
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
        name="index"
        options={{ animation: "fade" }}
      />
      <Stack.Screen
        name="(auth)"
        options={{ animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="game"
        options={{ animation: "slide_from_bottom" }}
      />
      <Stack.Screen
        name="computerDifficultylevel"
      />
      <Stack.Screen
        name="online-matchmaking"
      />
    </Stack>
  );
}
