// import React, { useEffect } from "react";
// import { Tabs } from "expo-router";
// import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
// import { useColorScheme } from "react-native";
// import * as SplashScreen from "expo-splash-screen";
// import '../global.css';
// SplashScreen.preventAutoHideAsync();

// export default function TabLayout() {
//     const colorScheme = useColorScheme();

//     useEffect(() => {
//         SplashScreen.hideAsync();
//     }, []);

//     return (
//         <ThemeProvider
//             value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
//         >
//             <Tabs>
//                 <Tabs.Screen
//                     name="index"
//                     options={{
//                         title: "Home",
//                     }}
//                 />

//             </Tabs>
//         </ThemeProvider>
//     );
// }
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="game"
          options={{ title: "Chess" }}
        />
        <Stack.Screen
          name="computerDifficultylevel"
          options={{ title: "Choose Difficulty" }}
        />
        <Stack.Screen
          name="online-matchmaking"
          options={{ title: "Online Matchmaking" }}
        />
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />
      </Stack>
    </ThemeProvider>
  );
}