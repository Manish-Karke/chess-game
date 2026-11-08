import { useLocalSearchParams } from "expo-router";
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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useUploadPdfViewModel } from "@/features/store/presentation/viewModels/useUploadPdfViewModel";

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

export default function UploadProductPdfScreen() {
  const params = useLocalSearchParams<{ id?: string }>();
  const productId = params.id ?? "";

  const {
    fileUri,
    fileName,
    setFileUri,
    setFileName,
    uploading,
    serverError,
    pickFile,
    upload,
  } = useUploadPdfViewModel({
    productId,
    onUploaded: () => {
      router.replace("/admin/products");
    },
  });

  if (!productId) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        style={styles.scroll}
      >
        <View style={styles.header}>
          <Ionicons name="document-text-outline" size={26} color={COLORS.goldLight} />
          <Text style={styles.title}>Upload PDF</Text>
          <Text style={styles.subtitle}>
            Upload the PDF file for this product (max 20 MB).
          </Text>
        </View>

        {serverError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{serverError}</Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>PDF file URI</Text>
          <TextInput
            value={fileUri}
            onChangeText={setFileUri}
            style={styles.input}
            placeholder="file:///data/user/0/.../document.pdf"
          />
        </View>

        <View style={styles.fileRow}>
          <Text style={styles.fileNameText}>
            {fileName || "No file selected"}
          </Text>
          <Pressable
            onPress={pickFile}
            style={styles.pickButton}
            hitSlop={10}
          >
            <Text style={styles.pickText}>Choose file</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={upload}
          style={[
            styles.uploadButton,
            uploading && { backgroundColor: COLORS.muted },
          ]}
          disabled={uploading || !fileUri}
          hitSlop={12}
        >
          {uploading ? (
            <Text style={styles.uploadText}>Uploading…</Text>
          ) : (
            <Text style={styles.uploadText}>Upload PDF</Text>
          )}
        </Pressable>

        <View style={styles.hintBox}>
          <Text style={styles.hintTitle}>Native file picker</Text>
          <Text style={styles.hintText}>
            expo-document-picker is not installed in this workspace, so the
            "Choose file" button shows instructions instead. To enable native
            picking, run:
          </Text>
          <Text style={styles.hintCode}>npx expo install expo-document-picker</Text>
          <Text style={styles.hintText}>
            then wire DocumentPicker into useUploadPdfViewModel.
          </Text>
        </View>
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
    gap: 4,
  },
  title: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 13,
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
    fontSize: 13,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 6,
  },
  fileNameText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  pickButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gold,
    backgroundColor: "transparent",
  },
  pickText: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: "700",
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.gold,
  },
  uploadText: {
    color: "#17110A",
    fontSize: 16,
    fontWeight: "800",
  },
  hintBox: {
    marginTop: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  hintTitle: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 4,
  },
  hintText: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  hintCode: {
    color: COLORS.goldLight,
    fontSize: 12,
    fontFamily: "monospace",
    fontWeight: "600",
    marginBottom: 4,
  },
});
