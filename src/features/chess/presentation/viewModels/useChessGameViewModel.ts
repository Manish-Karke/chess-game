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
import { MovePieceUseCase } from "../../domain/useCases/MovePieceUseCase";

export type ChessTurn = "white" | "black";

type SelectedSquare = BoardPosition | null;

type UseChessGameViewModelParams = {
    getValidMovesUseCase: GetValidMovesUseCase;
    movePieceUseCase: MovePieceUseCase;
};

export function useChessGameViewModel({
    getValidMovesUseCase,
    movePieceUseCase,
}: UseChessGameViewModelParams) {
    const [pieces, setPieces] = useState<ChessPiece[]>(initialChessPieces);

    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);

    const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

    const [currentTurn, setCurrentTurn] = useState<ChessTurn>("white");

    const [validMoves, setValidMoves] = useState<BoardPosition[]>([]);

    const clearSelection = () => {
        setSelectedPieceId(null);
        setSelectedSquare(null);
        setValidMoves([]);
    };

    const selectPiece = (piece: ChessPiece) => {
        const moves = getValidMovesUseCase.execute({
            piece,
            pieces,
        });

        setSelectedPieceId(piece.id);

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

        // Nothing selected
        if (!selectedSquare) {
            if (!piece) return;

            if (piece.color !== currentTurn) {
                return;
            }

            selectPiece(piece);
            return;
        }

        // Same square -> deselect
        if (selectedSquare.row === row && selectedSquare.column === column) {
            clearSelection();
            return;
        }

        // Select another own piece
        if (piece?.color === currentTurn) {
            selectPiece(piece);
            return;
        }

        // Check destination
        const isValidMove = validMoves.some(
            (move) => move.row === row && move.column === column,
        );

        if (!isValidMove) {
            return;
        }

        if (!selectedPieceId) {
            return;
        }

        // Move / capture
        const updatedPieces = movePieceUseCase.execute({
            pieces,
            pieceId: selectedPieceId,
            target: {
                row,
                column,
            },
        });

        setPieces(updatedPieces);

        // Switch turn
        setCurrentTurn((previousTurn) =>
            previousTurn === "white" ? "black" : "white",
        );

        clearSelection();
    };

    return {
        pieces,
        selectedSquare,
        selectedPieceId,
        validMoves,
        currentTurn,
        handleSquarePress,
    };
}
