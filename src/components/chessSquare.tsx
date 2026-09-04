import React, { memo } from "react";
import { Pressable, View } from "react-native";

import { ChessPiece } from "@/features/chess/domain/entities/ChessPiece";
import ChessPieceIcon from "@/features/chess/presentation/components/ChessPieceIcon";

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
    onPress,
}: ChessSquareProps) {
    const backgroundColor = isSelected
    ? "#FACC15"
    : isLastMove
      ? "#D6B85A"
      : isLight
        ? "#F0D9B5"
        : "#B58863";
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
                        backgroundColor: "rgba(30, 30, 30, 0.25)",
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
                        borderColor: "rgba(30, 30, 30, 0.25)",
                    }}
                />
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