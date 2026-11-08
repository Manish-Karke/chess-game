import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";

import { useCreateProductViewModel } from "@/features/store/presentation/viewModels/useCreateProductViewModel";

const COLORS = {
  background: "#050A12",
  card: "#111823",
  cardBorder: "#343B47",
  gold: "#D9A441",
  goldLight: "#F4D18A",
  white: "#FFFFFF",
  muted: "#B7BBC5",
  error: "#FF9696",
};

export default function CreateProductScreen() {
  const [type, setType] = useState<"PDF" | "COURSE">("PDF");
  const {
    form,
    submit,
    serverError,
    isSubmitting,
  } = useCreateProductViewModel({
    onCreated: (product) => {
      router.push(`/admin/products/${product.id}/upload`);
    },
  });

  const { control } = form;

  const toggleType = (value: "PDF" | "COURSE") => {
    setType(value);
    form.setValue("type", value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.header}>
          <Ionicons name="add-outline" size={26} color={COLORS.goldLight} />
          <Text style={styles.title}>Add Product</Text>
        </View>

        {serverError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{serverError}</Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextInput
                {...field}
                style={styles.input}
                placeholder="e.g. Chess Opening Guide"
              />
            )}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Slug</Text>
          <Controller
            control={control}
            name="slug"
            render={({ field }) => (
              <TextInput
                {...field}
                style={styles.input}
                placeholder="e.g. chess-opening-guide"
              />
            )}
          />
          <Text style={styles.hint}>
            Lowercase letters, numbers and hyphens only.
          </Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextInput
                {...field}
                style={[styles.input, { minHeight: 88, textAlignVertical: "top" }]}
                placeholder="What does this PDF/course cover?"
              />
            )}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeToggle}>
            <Pressable
              onPress={() => toggleType("PDF")}
              style={[
                styles.typeChip,
                type === "PDF" && styles.typeChipActive,
              ]}
              hitSlop={8}
            >
              <Text style={[styles.typeChipText, type === "PDF" && styles.typeChipTextActive]}>
                PDF
              </Text>
            </Pressable>
            <Pressable
              onPress={() => toggleType("COURSE")}
              style={[
                styles.typeChip,
                type === "COURSE" && styles.typeChipActive,
              ]}
              hitSlop={8}
            >
              <Text style={[styles.typeChipText, type === "COURSE" && styles.typeChipTextActive]}>
                Course
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Price (NPR)</Text>
          <Controller
            control={control}
            name="priceMinor"
            render={({ field }) => (
              <TextInput
                {...field}
                style={styles.input}
                placeholder="e.g. 500"
                keyboardType="numeric"
              />
            )}
          />
          <Text style={styles.hint}>
            Enter the price in paisa (NPR 10.00 = 1000).
          </Text>
        </View>

        <Pressable
          onPress={submit}
          style={styles.submitButton}
          disabled={isSubmitting}
          hitSlop={12}
        >
          <Text style={styles.submitText}>
            {isSubmitting ? "Creating…" : "Create Product"}
          </Text>
        </Pressable>
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
    paddingHorizontal: 18,
    paddingVertical: 14,
    gap: 14,
  },
  header: {
    marginBottom: 6,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
  },
  errorBox: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(75, 25, 32, 0.88)",
    borderWidth: 1,
    borderColor: "rgba(255, 150, 150, 0.20)",
    marginBottom: 6,
  },
  errorText: {
    color: "#FFD2CE",
    fontSize: 13,
  },
  field: {
    marginBottom: 2,
  },
  label: {
    color: COLORS.muted,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    color: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 14,
  },
  hint: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 11,
  },
  typeToggle: {
    flexDirection: "row",
    gap: 8,
  },
  typeChip: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
  },
  typeChipActive: {
    borderColor: COLORS.gold,
    backgroundColor: "rgba(217, 164, 65, 0.15)",
  },
  typeChipText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
  },
  typeChipTextActive: {
    color: COLORS.goldLight,
  },
  submitButton: {
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.gold,
  },
  submitText: {
    color: "#17110A",
    fontSize: 16,
    fontWeight: "800",
  },
});
