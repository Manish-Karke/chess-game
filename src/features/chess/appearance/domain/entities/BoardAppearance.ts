
export type BoardThemeId = "walnut" | "green" | "ocean" | "midnight";

export type BoardTheme = {
  id: BoardThemeId;
  name: string;
  lightSquare: string;
  darkSquare: string;
  selectedSquare: string;
  lastMove: string;
  legalMove: string;
};

export type BoardAppearance = {
  themeId: BoardThemeId;
  showCoordinates: boolean;
};

export const BOARD_THEMES: Record<BoardThemeId, BoardTheme> = {
  walnut: {
    id: "walnut",
    name: "Walnut",
    lightSquare: "#F0D9B5",
    darkSquare: "#B58863",
    selectedSquare: "#FACC15",
    lastMove: "#D6B85A",
    legalMove: "#527A46",
  },
  green: {
    id: "green",
    name: "Tournament Green",
    lightSquare: "#EEEED2",
    darkSquare: "#769656",
    selectedSquare: "#F6F669",
    lastMove: "#BACA44",
    legalMove: "#4F7942",
  },
  ocean: {
    id: "ocean",
    name: "Ocean Blue",
    lightSquare: "#DEE3E6",
    darkSquare: "#6888A5",
    selectedSquare: "#F5D76E",
    lastMove: "#A6B8C9",
    legalMove: "#416C83",
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    lightSquare: "#AEB6C2",
    darkSquare: "#414B5A",
    selectedSquare: "#E5C15D",
    lastMove: "#68778B",
    legalMove: "#608A72",
  },
};

export const DEFAULT_BOARD_APPEARANCE: BoardAppearance = {
  themeId: "walnut",
  showCoordinates: true,
};
