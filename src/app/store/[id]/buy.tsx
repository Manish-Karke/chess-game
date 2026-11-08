
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useBuyViewModel } from "@/features/store/presentation/viewModels/useBuyViewModel";

const COLORS = {
  background: "#050A12",
  card: "#111823",
  cardBorder: "#343B47",
  gold: "#D9A441",
  goldLight: "#F4D18A",
  white: "#FFFFFF",
  muted: "#B7BBC5",
};

export default function BuyScreen() {
  const params = useLocalSearchParams<{ id?: string }>();

  const {
    status,
    error,
    orderId,
    pidx,
    paymentUrl,
    startPurchase,
    openPaymentPage,
    verifyPayment,
    isPaid,
  } = useBuyViewModel({
    productId: params.id ?? "",
  });

  if (!params.id) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.header}>
          <Ionicons
            name="card-outline"
            size={32}
            color={COLORS.goldLight}
          />
          <Text style={styles.title}>Buy PDF</Text>
        </View>

        {/* Step 1: Buy Now */}
        {status === "idle" && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>1. Create your order</Text>

            <Text style={styles.stepText}>
              Tap Buy Now to create your purchase order and prepare
              your Khalti payment.
            </Text>

            <Pressable
              onPress={startPurchase}
              style={styles.primaryButton}
              hitSlop={12}
            >
              <Text style={styles.buttonText}>Buy Now</Text>
            </Pressable>
          </View>
        )}

        {/* Creating order / initiating payment */}
        {(status === "creating-order" ||
          status === "initiating-payment") && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>
              {status === "creating-order"
                ? "Creating order…"
                : "Starting payment…"}
            </Text>

            <ActivityIndicator
              size="large"
              color={COLORS.gold}
              style={styles.spinner}
            />
          </View>
        )}

        {/* Step 2: Khalti checkout */}
        {status === "waiting-for-payment" && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>2. Pay on Khalti</Text>

            <Text style={styles.stepText}>
              Open the Khalti checkout page and complete your payment.
              When finished, return here and verify your payment.
            </Text>

            {error && (
              <Text style={styles.failureText}>{error}</Text>
            )}

            <Pressable
              onPress={openPaymentPage}
              style={styles.secondaryButton}
              hitSlop={12}
            >
              <Text style={styles.secondaryButtonText}>
                Open Khalti Payment
              </Text>
            </Pressable>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>Or</Text>
              <View style={styles.divider} />
            </View>

            <Pressable
              onPress={verifyPayment}
              style={styles.primaryButton}
              hitSlop={12}
            >
              <Text style={styles.buttonText}>Verify Payment</Text>
            </Pressable>
          </View>
        )}

        {/* Verifying */}
        {status === "verifying" && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Verifying payment…</Text>

            <Text style={styles.stepText}>
              We're confirming your transaction with Khalti.
            </Text>

            <ActivityIndicator
              size="large"
              color={COLORS.gold}
              style={styles.spinner}
            />
          </View>
        )}

        {/* Success */}
        {isPaid && (
          <View style={styles.successCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={48}
              color="#4ADE80"
            />

            <Text style={styles.successTitle}>
              Payment successful!
            </Text>

            {orderId && (
              <Text style={styles.successSubtitle}>
                Order {orderId.slice(0, 8)}… is paid and your content
                is ready.
              </Text>
            )}

            <Pressable
              onPress={() => router.replace("/library")}
              style={styles.primaryButton}
              hitSlop={12}
            >
              <Text style={styles.buttonText}>Go to Library</Text>
            </Pressable>
          </View>
        )}

        {/* Failure */}
        {status === "failure" && (
          <View style={styles.failureCard}>
            <Ionicons
              name="alert-circle-outline"
              size={32}
              color="#FF9696"
            />

            <Text style={styles.failureTitle}>
              Payment could not be completed
            </Text>

            {error && (
              <Text style={styles.failureText}>{error}</Text>
            )}

            <Pressable
              onPress={startPurchase}
              style={styles.primaryButton}
              hitSlop={12}
            >
              <Text style={styles.buttonText}>
                {orderId ? "Retry Payment" : "Try Again"}
              </Text>
            </Pressable>
          </View>
        )}

        {/* Payment reference */}
        {pidx && status === "waiting-for-payment" && (
          <View style={styles.hint}>
            <Text style={styles.hintText}>
              Khalti reference: {pidx}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },
  stepCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  stepTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6,
  },
  stepText: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  spinner: {
    marginTop: 8,
    alignSelf: "center",
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
  },
  buttonText: {
    color: "#17110A",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  secondaryButtonText: {
    color: COLORS.goldLight,
    fontSize: 15,
    fontWeight: "800",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  dividerText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
    marginHorizontal: 8,
  },
  successCard: {
    padding: 22,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "rgba(74,222,128,0.10)",
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.25)",
    gap: 10,
  },
  successTitle: {
    color: "#4ADE80",
    fontSize: 18,
    fontWeight: "800",
    textAlign: "center",
  },
  successSubtitle: {
    color: COLORS.white,
    fontSize: 13,
    textAlign: "center",
  },
  failureCard: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "rgba(75,25,32,0.88)",
    borderWidth: 1,
    borderColor: "rgba(255,150,150,0.20)",
    gap: 10,
  },
  failureTitle: {
    color: "#FF9696",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  failureText: {
    marginVertical: 8,
    color: "#FFD2CE",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  hint: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
  },
  hintText: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
  },
});
