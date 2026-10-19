
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  BOARD_THEMES,
  type BoardThemeId,
} from "../domain/entities/BoardAppearance";
import { useBoardAppearance } from "./BoardAppearanceProvider";

const COLORS = {
  background: "#050A12",
  surface: "#111823",
  surfaceSelected: "#191F2A",
  border: "#303744",
  gold: "#D9A441",
  goldLight: "#F4D18A",
  white: "#FFFFFF",
  muted: "#A8AFBC",
};

type BoardPreviewProps = {
  lightSquare: string;
  darkSquare: string;
  size: number;
};

function BoardPreview({
  lightSquare,
  darkSquare,
  size,
}: BoardPreviewProps) {
  const squareSize = size / 8;

  return (
    <View
      style={[
        styles.previewBoard,
        { width: size, height: size },
      ]}
    >
      {Array.from({ length: 64 }, (_, index) => {
        const row = Math.floor(index / 8);
        const column = index % 8;
        const isLight = (row + column) % 2 === 0;

        return (
          <View
            key={index}
            style={{
              width: squareSize,
              height: squareSize,
              backgroundColor: isLight ? lightSquare : darkSquare,
            }}
          />
        );
      })}
    </View>
  );
}

export function BoardAppearanceScreen() {
  const {
    appearance,
    theme,
    isLoaded,
    setTheme,
    setShowCoordinates,
  } = useBoardAppearance();

  const [savingTheme, setSavingTheme] =
    useState<BoardThemeId | null>(null);
  const [savingCoordinates, setSavingCoordinates] = useState(false);

  const themes = Object.values(BOARD_THEMES);

  const handleThemeSelect = async (themeId: BoardThemeId) => {
    if (themeId === appearance.themeId || savingTheme !== null) {
      return;
    }

    setSavingTheme(themeId);

    try {
      await setTheme(themeId);
    } catch {
      Alert.alert(
        "Couldn't save theme",
        "Please try selecting the theme again.",
      );
    } finally {
      setSavingTheme(null);
    }
  };

  const handleCoordinatesToggle = async (show: boolean) => {
    if (savingCoordinates) return;

    setSavingCoordinates(true);

    try {
      await setShowCoordinates(show);
    } catch {
      Alert.alert(
        "Couldn't save setting",
        "Please try changing this setting again.",
      );
    } finally {
      setSavingCoordinates(false);
    }
  };

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.gold} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
          >
            <Ionicons
              name="arrow-back"
              size={21}
              color={COLORS.goldLight}
            />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.brand}>CHESS ARENA</Text>
            <Text style={styles.title}>Board appearance</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Choose your board colors
        </Text>

        {/* Current board */}
        <View style={styles.currentBoardSection}>
          <View style={styles.boardFrame}>
            <BoardPreview
              lightSquare={theme.lightSquare}
              darkSquare={theme.darkSquare}
              size={248}
            />
          </View>

          <View style={styles.currentThemeRow}>
            <View style={styles.currentThemeText}>
              <Text style={styles.currentThemeName}>
                {theme.name}
              </Text>
              <Text style={styles.currentThemeDescription}>
                Current board
              </Text>
            </View>

            <Ionicons
              name="checkmark-circle"
              size={25}
              color={COLORS.gold}
            />
          </View>
        </View>

        {/* Theme choices */}
        <View style={styles.sectionHeading}>
          <Text style={styles.sectionTitle}>Board themes</Text>
          <Text style={styles.sectionHint}>
            {themes.length} options
          </Text>
        </View>

        <View style={styles.themeGrid}>
          {themes.map((option) => {
            const selected = appearance.themeId === option.id;
            const saving = savingTheme === option.id;

            return (
              <Pressable
                key={option.id}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${option.name} board theme`}
                disabled={savingTheme !== null}
                onPress={() => handleThemeSelect(option.id)}
                style={({ pressed }) => [
                  styles.themeOption,
                  selected && styles.themeOptionSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.themePreview}>
                  <BoardPreview
                    lightSquare={option.lightSquare}
                    darkSquare={option.darkSquare}
                    size={66}
                  />
                </View>

                <View style={styles.themeOptionFooter}>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.themeName,
                      selected && styles.themeNameSelected,
                    ]}
                  >
                    {option.name}
                  </Text>

                  {saving ? (
                    <ActivityIndicator
                      size="small"
                      color={COLORS.goldLight}
                    />
                  ) : selected ? (
                    <Ionicons
                      name="checkmark-circle"
                      size={19}
                      color={COLORS.gold}
                    />
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceIcon}>
            <Ionicons
              name="grid-outline"
              size={21}
              color={COLORS.goldLight}
            />
          </View>

          <View style={styles.preferenceText}>
            <Text style={styles.preferenceTitle}>
              Show coordinates
            </Text>
            <Text style={styles.preferenceDescription}>
              Display letters and numbers around the board
            </Text>
          </View>

          <Switch
            value={appearance.showCoordinates}
            onValueChange={handleCoordinatesToggle}
            disabled={savingCoordinates}
            trackColor={{
              false: "#454B56",
              true: COLORS.gold,
            }}
            thumbColor="#FFFFFF"
            accessibilityLabel="Show board coordinates"
          />
        </View>

        <View style={styles.bottomNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={COLORS.muted}
          />
          <Text style={styles.bottomNoteText}>
            Your choices are saved on this device.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  brand: {
    color: COLORS.goldLight,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 2,
  },
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 22,
    marginBottom: 18,
    color: COLORS.muted,
    fontSize: 14,
  },
  currentBoardSection: {
    alignItems: "center",
  },
  boardFrame: {
    padding: 4,
    borderRadius: 7,
    backgroundColor: "#171D27",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  previewBoard: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    borderRadius: 3,
  },
  currentThemeRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  currentThemeText: {
    gap: 4,
  },
  currentThemeName: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "700",
  },
  currentThemeDescription: {
    color: COLORS.muted,
    fontSize: 12,
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 25,
    marginBottom: 14,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
  },
  sectionHint: {
    color: COLORS.muted,
    fontSize: 12,
  },
  themeGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 28,
  },
  themeOption: {
    flex: 1,
    minWidth: 0,
    padding: 7,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  themeOptionSelected: {
    backgroundColor: COLORS.surfaceSelected,
    borderColor: COLORS.gold,
  },
  themePreview: {
    alignItems: "center",
    paddingVertical: 4,
  },
  themeOptionFooter: {
    minHeight: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    marginTop: 5,
  },
  themeName: {
    flexShrink: 1,
    color: "#D6DAE2",
    fontSize: 10,
    fontWeight: "600",
  },
  themeNameSelected: {
    color: COLORS.goldLight,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 13,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
    backgroundColor: COLORS.surface,
  },
  preferenceText: {
    flex: 1,
    gap: 4,
  },
  preferenceTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  preferenceDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  bottomNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    marginTop: 20,
  },
  bottomNoteText: {
    color: COLORS.muted,
    fontSize: 11,
  },
  pressed: {
    opacity: 0.75,
  },
});
