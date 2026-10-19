
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  BOARD_THEMES,
  DEFAULT_BOARD_APPEARANCE,
  type BoardAppearance,
  type BoardThemeId,
} from "../../domain/entities/BoardAppearance";

import type { BoardAppearanceRepository } from "../../domain/repositories/BoardAppearanceRepository";

const STORAGE_KEY = "@chess/board-appearance";

function isBoardAppearance(value: unknown): value is BoardAppearance {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.themeId === "string" &&
    candidate.themeId in BOARD_THEMES &&
    typeof candidate.showCoordinates === "boolean"
  );
}

export class AsyncStorageBoardAppearanceRepository
  implements BoardAppearanceRepository
{
  async get(): Promise<BoardAppearance> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (!stored) return DEFAULT_BOARD_APPEARANCE;

      const parsed: unknown = JSON.parse(stored);

      return isBoardAppearance(parsed)
        ? parsed
        : DEFAULT_BOARD_APPEARANCE;
    } catch {
      return DEFAULT_BOARD_APPEARANCE;
    }
  }

  async save(appearance: BoardAppearance): Promise<void> {
    const safeAppearance: BoardAppearance = {
      themeId: appearance.themeId as BoardThemeId,
      showCoordinates: appearance.showCoordinates,
    };

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(safeAppearance),
    );
  }
}
