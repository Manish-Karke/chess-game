import { router, useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#050A12",
  cardBorder: "#343B47",
  gold: "#D9A441",
  goldLight: "#F4D18A",
  white: "#FFFFFF",
  muted: "#B7BBC5",
};

export default function PaymentSuccessScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.card}>
          <Ionicons name="checkmark-circle-outline" size={56} color="#4ADE80" />
          <Text style={styles.title}>Payment Successful</Text>
          {params.orderId && (
            <Text style={styles.orderId}>
              Order: {params.orderId.slice(0, 8)}…
            </Text>
          )}
          <Text style={styles.body}>
            Your purchase is complete and the content is now available in your
            Library.
          </Text>
        </View>

        <View style={styles.buttons}>
          <Pressable
            onPress={() => {
              router.replace("/library");
            }}
            style={styles.button}
            hitSlop={12}
          >
            <Text style={styles.buttonText}>Go to Library</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.replace("/store");
            }}
            style={styles.buttonOutline}
            hitSlop={12}
          >
            <Text style={styles.buttonOutlineText}>Browse Store</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  card: {
    alignItems: "center",
    padding: 24,
    borderRadius: 22,
    backgroundColor: "#111823",
    borderWidth: 1,
    borderColor: "#343B47",
  },
  title: {
    marginTop: 14,
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  orderId: {
    marginTop: 8,
    color: COLORS.muted,
    fontSize: 13,
    fontFamily: "monospace",
    textAlign: "center",
  },
  body: {
    marginTop: 12,
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  buttons: {
    marginTop: 24,
    gap: 10,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.gold,
    width: "100%",
  },
  buttonText: {
    color: "#17110A",
    fontSize: 16,
    fontWeight: "800",
  },
  buttonOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: "transparent",
    width: "100%",
  },
  buttonOutlineText: {
    color: COLORS.goldLight,
    fontSize: 16,
    fontWeight: "700",
  },
});
