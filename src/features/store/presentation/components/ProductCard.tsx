import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { Product } from "../../domain/repositories/StoreRepository";

type ProductCardProps = {
  product: Product;
  onPress: (product: Product) => void;
};

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

function typeIcon(type: Product["type"]) {
  return type === "PDF" ? "document-text-outline" : "school-outline";
}

function formatPrice(priceMinor: number, currency: string) {
  const units = priceMinor / 100;
  return `${currency} ${units.toFixed(2)}`;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const isPdf = product.type === "PDF";
  const free = product.priceMinor === 0;

  return (
    <Pressable
      style={[styles.card, product.status !== "PUBLISHED" && styles.draftCard]}
      onPress={() => onPress(product)}
      hitSlop={10}
    >
      <View style={styles.iconBox}>
        <Ionicons
          name={typeIcon(product.type)}
          size={30}
          color={isPdf ? COLORS.goldLight : "#9DD7FD"}
        />
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={[styles.title, product.status !== "PUBLISHED" && styles.draftText]}>
            {product.title}
          </Text>
          {product.status !== "PUBLISHED" && (
            <Text style={styles.badge}>DRAFT</Text>
          )}
        </View>

        {product.description && (
          <Text style={styles.description}>
            {product.description.slice(0, 90)}{
              product.description.length > 90 ? "…" : ""
            }
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>
            {free ? "Free" : formatPrice(product.priceMinor, product.currency)}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.typeText}>
            {isPdf ? "PDF" : "Course"} · {product.status}
          </Text>
        </View>
      </View>

      <View style={styles.arrow}>
        <Ionicons name="chevron-forward" size={18} color={COLORS.muted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  draftCard: {
    borderColor: "rgba(255, 255, 255, 0.10)",
    opacity: 0.9,
  },
  iconBox: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "rgba(217, 164, 65, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(217, 164, 65, 0.30)",
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },
  draftText: {
    color: COLORS.muted,
  },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    color: COLORS.muted,
    textTransform: "uppercase",
    marginLeft: 8,
  },
  description: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price: {
    color: COLORS.goldLight,
    fontSize: 14,
    fontWeight: "800",
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    marginHorizontal: 8,
  },
  typeText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "600",
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
});
