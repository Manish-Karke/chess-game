
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useSession } from "@/features/auth/presentation/session/SessionProvider";

export default function Index() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#050A12",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#D6B36A" />
      </View>
    );
  }

  return (
    <Redirect
      href={
        status === "authenticated"
          ? "/home"
          : "/(auth)/login"
      }
    />
  );
}
