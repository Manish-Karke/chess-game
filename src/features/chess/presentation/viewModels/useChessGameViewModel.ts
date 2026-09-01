//selection

import { useState } from "react";
import { ChessPiece } from "../../domain/entities/ChessPiece";
import { initialChessPieces } from "../../domain/constants/initialChessPieces";

export type ChessTurn = "white" | "black";

type SelectedSquare = {
    row: number;
    column: number;
} | null;

export function useChessGameViewModel() {
    const [pieces, setPieces] = useState<ChessPiece[]>(initialChessPieces);

    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);
    const [currentTurn, setCurrentTurn] = useState<ChessTurn>("white");

    const handleSquarePress = (row: number, column: number) => {
        const piece = pieces.find(
            (item) => item.row === row && item.column === column,
        );

        if (!selectedSquare) {
            if (!piece) {
                return;
            }

            if (piece?.color !== currentTurn) {
                return;
            }

            setSelectedSquare({
                row,
                column,
            });

            return;
        }

        if (selectedSquare?.row === row && selectedSquare?.column === column) {
            setSelectedSquare(null);
            return;
        }

        if (piece?.color === currentTurn) {
            setSelectedSquare({
                row,
                column,
            });
            return;
        }
    };

    return {
        pieces,
        selectedSquare,
        currentTurn,
        handleSquarePress,
    };
}
