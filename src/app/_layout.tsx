// app/(tabs)/_layout.tsx

import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import '../global.css';
SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
    const colorScheme = useColorScheme();

    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <Tabs>
                <Tabs.Screen
                    name="index"
                    options={{
                        title: "Home",
                    }}
                />

                {/* <Tabs.Screen
                    name="explore"
                    options={{
                        title: "Explore",
                    }}
                /> */}
            </Tabs>
        </ThemeProvider>
    );
}
