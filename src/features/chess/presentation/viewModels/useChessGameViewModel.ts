// //selection

// import { useState } from "react";
// import { BoardPosition, ChessPiece } from "../../domain/entities/ChessPiece";
// import { initialChessPieces } from "../../domain/constants/initialChessPieces";
// import { GetValidMovesUseCase } from "../../domain/useCases/GetValidMovesUseCase";
// export type ChessTurn = "white" | "black";

// type useChessGameViewModelParams={
//     getValidMoveUseCase:GetValidMovesUseCase
// }

// type SelectedSquare = {
//     row: number;
//     column: number;
// } | null;

// export function useChessGameViewModel({getValidMoveUseCase}:useChessGameViewModelParams) {
//     const [pieces, setPieces] = useState<ChessPiece[]>(initialChessPieces);

//     const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);
//     const [currentTurn, setCurrentTurn] = useState<ChessTurn>("white");
//     const [validMoves, setValidMoves] = useState<BoardPosition[]>([]);
//     const handleSquarePress = (row: number, column: number) => {
//         const piece = pieces.find(
//             (item) => item.row === row && item.column === column,
//         );

//         if (!selectedSquare) {
//             if (!piece) {
//                 return;
//             }

//             if (piece?.color !== currentTurn) {
//                 return;
//             }
//             const moves = getValidMoveUseCase({piece, pieces});

//             setSelectedSquare({
//                 row,
//                 column,
//             });
//             setValidMoves(moves)
//             return;
//         }

//         if (selectedSquare?.row === row && selectedSquare?.column === column) {
//             setSelectedSquare(null);
//             return;
//         }

//         if (piece?.color === currentTurn) {
//             setSelectedSquare({
//                 row,
//                 column,
//             });
//             return;
//         }
//     };

//     return {
//         pieces,
//         selectedSquare,
//         currentTurn,
//         handleSquarePress,
//     };
// }
import { useState } from "react";

import { initialChessPieces } from "../../domain/constants/initialChessPieces";
import { BoardPosition, ChessPiece } from "../../domain/entities/ChessPiece";
import { GetValidMovesUseCase } from "../../domain/useCases/GetValidMovesUseCase";

export type ChessTurn = "white" | "black";

type SelectedSquare = BoardPosition | null;

type UseChessGameViewModelParams = {
    getValidMovesUseCase: GetValidMovesUseCase;
};

export function useChessGameViewModel({
    getValidMovesUseCase,
}: UseChessGameViewModelParams) {
    const [pieces, setPieces] = useState<ChessPiece[]>(initialChessPieces);

    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);

    const [currentTurn, setCurrentTurn] = useState<ChessTurn>("white");

    const [validMoves, setValidMoves] = useState<BoardPosition[]>([]);

    const clearSelection = () => {
        setSelectedSquare(null);
        setValidMoves([]);
    };

    const selectPiece = (piece: ChessPiece) => {
        const moves = getValidMovesUseCase.execute({
            piece,
            pieces,
        });

        setSelectedSquare({
            row: piece.row,
            column: piece.column,
        });

        setValidMoves(moves);
    };

    const handleSquarePress = (row: number, column: number) => {
        const piece = pieces.find(
            (item) => item.row === row && item.column === column,
        );

        // No piece currently selected
        if (!selectedSquare) {
            if (!piece) return;

            if (piece.color !== currentTurn) {
                return;
            }

            selectPiece(piece);

            return;
        }

        // Tap same square -> deselect
        if (selectedSquare.row === row && selectedSquare.column === column) {
            clearSelection();

            return;
        }

        // Tap another piece of the current player
        if (piece?.color === currentTurn) {
            selectPiece(piece);

            return;
        }

        // Movement will come here next
    };

    return {
        pieces,
        selectedSquare,
        validMoves,
        currentTurn,
        handleSquarePress,
    };
}
