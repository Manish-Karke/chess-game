
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BOARD_THEMES,
  DEFAULT_BOARD_APPEARANCE,
  type BoardAppearance,
  type BoardTheme,
  type BoardThemeId,
} from "../domain/entities/BoardAppearance";

import { GetBoardAppearance } from "../application/usecases/GetBoardAppearance";
import { SaveBoardAppearance } from "../application/usecases/SaveBoardAppearance";
import { AsyncStorageBoardAppearanceRepository } from "../infrastructure/storage/AsyncStorageBoardAppearanceRepository";

type BoardAppearanceContextValue = {
  appearance: BoardAppearance;
  theme: BoardTheme;
  isLoaded: boolean;
  setTheme: (themeId: BoardThemeId) => Promise<void>;
  setShowCoordinates: (show: boolean) => Promise<void>;
};

const repository = new AsyncStorageBoardAppearanceRepository();
const getAppearance = new GetBoardAppearance(repository);
const saveAppearance = new SaveBoardAppearance(repository);

const BoardAppearanceContext =
  createContext<BoardAppearanceContextValue | null>(null);

export function BoardAppearanceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [appearance, setAppearance] = useState<BoardAppearance>(
    DEFAULT_BOARD_APPEARANCE,
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    getAppearance.execute()
      .then((saved) => {
        if (active) setAppearance(saved);
      })
      .catch(() => {
        // Keep the defaults if loading fails.
      })
      .finally(() => {
        if (active) setIsLoaded(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateAppearance = useCallback(
    async (next: BoardAppearance) => {
      const previous = appearance;

      // Update the UI immediately, then persist.
      setAppearance(next);

      try {
        await saveAppearance.execute(next);
      } catch (error) {
        setAppearance(previous);
        throw error;
      }
    },
    [appearance],
  );

  const setTheme = useCallback(
    (themeId: BoardThemeId) =>
      updateAppearance({ ...appearance, themeId }),
    [appearance, updateAppearance],
  );

  const setShowCoordinates = useCallback(
    (showCoordinates: boolean) =>
      updateAppearance({ ...appearance, showCoordinates }),
    [appearance, updateAppearance],
  );

  const value = useMemo(
    () => ({
      appearance,
      theme: BOARD_THEMES[appearance.themeId],
      isLoaded,
      setTheme,
      setShowCoordinates,
    }),
    [appearance, isLoaded, setTheme, setShowCoordinates],
  );

  return (
    <BoardAppearanceContext.Provider value={value}>
      {children}
    </BoardAppearanceContext.Provider>
  );
}

export function useBoardAppearance() {
  const context = useContext(BoardAppearanceContext);

  if (!context) {
    throw new Error(
      "useBoardAppearance must be used inside BoardAppearanceProvider",
    );
  }

  return context;
}
