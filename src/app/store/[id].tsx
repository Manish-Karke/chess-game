import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useProductViewModel } from "@/features/store/presentation/viewModels/useProductViewModel";

const COLORS = {
  background: "#050A12",
  card: "#111823",
  cardBorder: "#343B47",
  gold: "#D9A441",
  goldLight: "#F4D18A",
  white: "#FFFFFF",
  muted: "#B7BBC5",
  green: "#4ADE80",
};

export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const { product, loading, error } = useProductViewModel({
    productId: params.id ?? "",
  });

  if (!params.id) {
    return null;
  }

  if (loading && !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.gold} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error || "Product not found."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isDraft = product.status !== "PUBLISHED";
  const free = product.priceMinor === 0;
  const price = `${product.currency} ${(product.priceMinor / 100).toFixed(2)}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.iconBox}>
          <Ionicons
            name={
              product.type === "PDF"
                ? "document-text-outline"
                : "school-outline"
            }
            size={44}
            color={
              product.type === "PDF" ? COLORS.goldLight : "#9DD7FD"
            }
          />
        </View>

        <Text style={styles.title}>{product.title}</Text>

        {isDraft && (
          <Text style={styles.badge}>
            Draft product — not yet published
          </Text>
        )}

        {product.description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionLabel}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {product.type === "PDF" ? "PDF" : "Course"}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.metaText}>{product.currency}</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceText}>
            {free ? "Free" : price}
          </Text>
        </View>

        {isDraft ? (
          <View style={styles.emptyState}>
            <Ionicons name="lock-closed-outline" size={34} color={COLORS.muted} />
            <Text style={styles.emptyTitle}>Not available yet</Text>
            <Text style={styles.emptySubtitle}>
              This product is still a draft.
            </Text>
          </View>
        ) : (
          <Pressable
            onPress={() => router.push(`/store/${product.id}/buy`)}
            style={styles.buyButton}
            hitSlop={12}
          >
            <Ionicons name="card-outline" size={20} color="#17110A" />
            <Text style={styles.buyButtonText}>
              {free ? "Get for Free" : "Buy Now"}
            </Text>
          </Pressable>
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
    gap: 14,
  },
  iconBox: {
    alignItems: "center",
    marginBottom: 6,
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  badge: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  descriptionBox: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  descriptionLabel: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },
  description: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    marginHorizontal: 10,
  },
  priceCard: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  priceLabel: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  priceText: {
    color: COLORS.goldLight,
    fontSize: 17,
    fontWeight: "800",
  },
  buyButton: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 56,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.gold,
  },
  buyButtonText: {
    color: "#17110A",
    fontSize: 17,
    fontWeight: "800",
  },
  emptyState: {
    marginTop: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 10,
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "800",
  },
  emptySubtitle: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    color: "#FFB4A2",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
});

