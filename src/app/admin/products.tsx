
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useProductsViewModel } from "@/features/store/presentation/viewModels/useProductsViewModel";

const COLORS = {
  background: "#050A12",
  card: "#111823",
  cardBorder: "#343B47",
  gold: "#D9A441",
  goldLight: "#F4D18A",
  white: "#FFFFFF",
  muted: "#B7BBC5",
};

export default function AdminProductsScreen() {
  const { products, loading, error, load } = useProductsViewModel();

  useEffect(() => {
    load();
  }, [load]);

  const statusColor = (status: string): string => {
    switch (status) {
      case "PUBLISHED":
        return "#4ADE80";
      case "DRAFT":
        return "#F4D18A";
      case "ARCHIVED":
      default:
        return COLORS.muted;
    }
  };

  if (loading && products.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLORS.background}
        />
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.gold} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      {/* Product list owns its own scrolling */}
      <FlatList
        style={styles.list}
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              router.push({
                pathname: "/admin/products/[id]/upload",
                params: { id: item.id },
              })
            }
            hitSlop={10}
          >
            <View style={styles.body}>
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.meta}>
                {item.type} · {item.currency}{" "}
                {(item.priceMinor / 100).toFixed(2)}
              </Text>
            </View>

            <View style={styles.badgeBox}>
              <Text
                style={[
                  styles.badge,
                  { color: statusColor(item.status) },
                ]}
              >
                {item.status}
              </Text>
            </View>

            <View style={styles.arrow}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={COLORS.muted}
              />
            </View>
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Ionicons
                name="build-outline"
                size={26}
                color={COLORS.goldLight}
              />
              <Text style={styles.headerTitle}>Manage Products</Text>
            </View>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products available yet.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Fixed action area outside the FlatList */}
      <View style={styles.createSection}>
        <Pressable
          onPress={() => router.push("/admin/products/create")}
          style={styles.createButton}
          hitSlop={12}
        >
          <Ionicons name="add-outline" size={22} color="#17110A" />
          <Text style={styles.createButtonText}>Add Product</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },
  meta: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 12,
  },
  badgeBox: {
    alignItems: "center",
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  arrow: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  createSection: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: COLORS.gold,
  },
  createButtonText: {
    color: "#17110A",
    fontSize: 16,
    fontWeight: "800",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    padding: 18,
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "rgba(75, 25, 32, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(255, 150, 150, 0.20)",
  },
  errorText: {
    color: "#FFD2CE",
    fontSize: 13,
    textAlign: "center",
  },
  empty: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  listContent: {
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
    flexGrow: 1,
  },
});
