
import React, { memo } from "react";
import { Pressable, Text, View } from "react-native";

import type { ChessPiece } from "@/features/chess/domain/entities/ChessPiece";
import ChessPieceIcon from "@/features/chess/presentation/components/ChessPieceIcon";

import type { BoardTheme } from "../features/chess/appearance/domain/entities/BoardAppearance";

type ChessSquareProps = {
  row: number;
  column: number;
  size: number;
  piece?: ChessPiece;
  isLight: boolean;
  isSelected: boolean;
  isValidMove: boolean;
  isCaptureMove: boolean;
  isKingInCheck: boolean;
  isLastMove: boolean;
  showCoordinates: boolean;
  theme: BoardTheme;
  onPress: (row: number, column: number) => void;
};

function ChessSquareComponent({
  row,
  column,
  size,
  piece,
  isLight,
  isSelected,
  isValidMove,
  isCaptureMove,
  isKingInCheck,
  isLastMove,
  showCoordinates,
  theme,
  onPress,
}: ChessSquareProps) {
  const backgroundColor = isSelected
    ? theme.selectedSquare
    : isLastMove
      ? theme.lastMove
      : isLight
        ? theme.lightSquare
        : theme.darkSquare;

  const coordinateColor = isLight
    ? theme.darkSquare
    : theme.lightSquare;

  return (
    <Pressable
      onPress={() => onPress(row, column)}
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor,
      }}
    >
      {isKingInCheck && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(220, 38, 38, 0.55)",
          }}
        />
      )}

      {isValidMove && !piece && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: size * 0.26,
            height: size * 0.26,
            borderRadius: size,
            backgroundColor: theme.legalMove,
            opacity: 0.7,
          }}
        />
      )}

      {isCaptureMove && piece && (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            width: size * 0.88,
            height: size * 0.88,
            borderRadius: size,
            borderWidth: size * 0.07,
            borderColor: "rgba(30, 30, 30, 0.3)",
          }}
        />
      )}

      {showCoordinates && column === 0 && (
        <Text
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 2,
            left: 3,
            fontSize: Math.max(8, size * 0.15),
            fontWeight: "700",
            color: coordinateColor,
          }}
        >
          {8 - row}
        </Text>
      )}

      {showCoordinates && row === 7 && (
        <Text
          pointerEvents="none"
          style={{
            position: "absolute",
            bottom: 1,
            right: 3,
            fontSize: Math.max(8, size * 0.15),
            fontWeight: "700",
            color: coordinateColor,
          }}
        >
          {"abcdefgh"[column]}
        </Text>
      )}

      {piece && (
        <ChessPieceIcon
          type={piece.type}
          color={piece.color}
          size={size * 0.78}
        />
      )}
    </Pressable>
  );
}

export const ChessSquare = memo(ChessSquareComponent);
