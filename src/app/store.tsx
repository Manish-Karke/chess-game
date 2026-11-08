
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
import { ProductCard } from "@/features/store/presentation/components/ProductCard";

const COLORS = {
  background: "#050A12",
  gold: "#D9A441",
  goldLight: "#F4D18A",
  white: "#FFFFFF",
  muted: "#B7BBC5",
};

export default function StoreScreen() {
  const { products, loading, error, load } = useProductsViewModel();

  useEffect(() => {
    load();
  }, [load]);

  const handleOpenLibrary = () => {
    router.push("/library");
  };

  const handleRetry = () => {
    load();
  };

  const handleProductPress = (productId: string) => {
    router.push({
      pathname: "/store/[id]",
      params: { id: productId },
    });
  };

  const renderEmpty = () => (
    <View style={styles.empty}>
      <Ionicons name="cart-outline" size={48} color={COLORS.muted} />
      <Text style={styles.emptyTitle}>No products yet</Text>
      <Text style={styles.emptySubtitle}>
        The chess store is empty. Check back soon!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={(product) => handleProductPress(product.id)}
          />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <View style={styles.titleBox}>
                <Ionicons
                  name="storefront-outline"
                  size={26}
                  color={COLORS.goldLight}
                />
                <Text style={styles.title}>Chess Store</Text>
              </View>

              <Pressable
                onPress={handleOpenLibrary}
                style={styles.libraryLink}
                hitSlop={12}
              >
                <Text style={styles.libraryText}>Library</Text>
              </Pressable>
            </View>

            <Text style={styles.subtitle}>
              Buy chess PDFs and courses. Prices are in NPR.
            </Text>

            {loading && products.length === 0 && (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color={COLORS.gold} />
              </View>
            )}

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
                <Pressable onPress={handleRetry} style={styles.retryButton}>
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? renderEmpty : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  titleBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "800",
  },
  libraryLink: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  libraryText: {
    color: COLORS.goldLight,
    fontSize: 14,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 12,
  },
  loading: {
    paddingVertical: 40,
    alignItems: "center",
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
    marginBottom: 10,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#3E2723",
  },
  retryText: {
    color: "#FFB4A2",
    fontSize: 13,
    fontWeight: "700",
  },
  empty: {
    paddingVertical: 60,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 12,
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "800",
  },
  emptySubtitle: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
