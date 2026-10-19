import {
    BoardPosition,
    ChessPiece,
} from "@/features/chess/domain/entities/ChessPiece";

import React, { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";

import { ChessSquare } from "./chessSquare";
import { useBoardAppearance } from "@/features/chess/appearance/presentation/BoardAppearanceProvider";
const BOARD_DIMENSION = 8;
const HORIZONTAL_PADDING = 16;
const MAX_BOARD_SIZE = 520;

type ChessBoardProps = {
    pieces: ChessPiece[];
    selectedSquare: BoardPosition | null;
    validMoves: BoardPosition[];
    checkedKingPosition: BoardPosition | null;
    lastMove?: {
        from: BoardPosition;
        to: BoardPosition;
    } | null;

    onSquarePress: (row: number, column: number) => void;
};

const getPositionKey = (row: number, column: number): string =>
    `${row}-${column}`;
export function ChessBoard({
    pieces,
    selectedSquare,
    validMoves,
    checkedKingPosition,
    lastMove,
    onSquarePress,
}: ChessBoardProps) {
    const { width } = useWindowDimensions();
    const { theme, appearance } = useBoardAppearance();

    const boardSize = Math.min(width - HORIZONTAL_PADDING * 2, MAX_BOARD_SIZE);

    const squareSize = boardSize / BOARD_DIMENSION;

    const pieceMap = useMemo(() => {
        const map = new Map<string, ChessPiece>();

        for (const piece of pieces) {
            map.set(getPositionKey(piece.row, piece.column), piece);
        }

        return map;
    }, [pieces]);

    const validMoveSet = useMemo(() => {
        return new Set(
            validMoves.map((move) => getPositionKey(move.row, move.column)),
        );
    }, [validMoves]);

    return (
        <View
            style={{
                width: boardSize,
                height: boardSize,
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            {Array.from({ length: 64 }).map((_, index) => {
                const row = Math.floor(index / BOARD_DIMENSION);
                const column = index % BOARD_DIMENSION;

                const key = getPositionKey(row, column);

                const piece = pieceMap.get(key);

                const isValidMove = validMoveSet.has(key);

                const isSelected =
                    selectedSquare?.row === row &&
                    selectedSquare?.column === column;

                const isKingInCheck =
                    checkedKingPosition?.row === row &&
                    checkedKingPosition?.column === column;

                const isLastMove =
                    (lastMove?.from.row === row &&
                        lastMove.from.column === column) ||
                    (lastMove?.to.row === row && lastMove.to.column === column);

                return (
                    <ChessSquare
                        key={key}
                        row={row}
                        column={column}
                        size={squareSize}
                        piece={piece}
                        isLight={(row + column) % 2 === 0}
                        isSelected={isSelected}
                        isValidMove={isValidMove}
                        isCaptureMove={isValidMove && Boolean(piece)}
                        isKingInCheck={isKingInCheck}
                        isLastMove={isLastMove}
                        showCoordinates={appearance.showCoordinates}
                        theme={theme}
                        onPress={onSquarePress}
                    />
                );
            })}
        </View>
    );
}
