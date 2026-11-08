import { Stack } from "expo-router";
import "../global.css";

import { SessionProvider } from "@/features/auth/presentation/session/SessionProvider";
import { BoardAppearanceProvider } from "@/features/chess/appearance/presentation/BoardAppearanceProvider";

export default function RootLayout() {
    return (
        <SessionProvider>
            <BoardAppearanceProvider>
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

                    <Stack.Screen name="computerDifficultylevel" />
                    <Stack.Screen name="online-matchmaking" />

                    {/* Store / payments */}
                    <Stack.Screen
                        name="store"
                        options={{ animation: "slide_from_right" }}
                    />
                    <Stack.Screen name="store/[id]" />
                    <Stack.Screen
                        name="store/[id]/buy"
                        options={{ animation: "slide_from_right" }}
                    />

                    {/* Payment results */}
                    <Stack.Screen
                        name="payment/success"
                        options={{ animation: "fade" }}
                    />
                    <Stack.Screen
                        name="payment/failure"
                        options={{ animation: "fade" }}
                    />

                    {/* Library */}
                    <Stack.Screen
                        name="library"
                        options={{ animation: "slide_from_right" }}
                    />

                    {/* Admin (product & PDF management) */}
                    <Stack.Screen
                        name="admin/products"
                        options={{ animation: "slide_from_right" }}
                    />
                    <Stack.Screen
                        name="admin/products/create"
                        options={{ animation: "slide_from_right" }}
                    />
                    <Stack.Screen name="admin/products/[id]/upload" />
                </Stack>
            </BoardAppearanceProvider>
        </SessionProvider>
    );
}
