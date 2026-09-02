import { useMemo, useState } from "react";

import { initialChessPieces } from "../../domain/constants/initialChessPieces";
import {
    BoardPosition,
    ChessPiece,
    GameState,
} from "../../domain/entities/ChessPiece";

import { GetLegalMovesUseCase } from "../../domain/useCases/GetLegalMovesUseCase";
import { MovePieceUseCase } from "../../domain/useCases/MovePieceUseCase";
import { IsKingInCheck } from "../../domain/rules/iskingInCheck";
import { isCheckmate } from "../../domain/rules/isCheckmate";
import { IsStalemate } from "../../domain/rules/isStalemate";

export type ChessTurn = "white" | "black";

type SelectedSquare = BoardPosition | null;

type UseChessGameViewModelParams = {
    getLegalMovesUseCase: GetLegalMovesUseCase;
    movePieceUseCase: MovePieceUseCase;
};

export function useChessGameViewModel({
    getLegalMovesUseCase,
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
        const moves = getLegalMovesUseCase.execute({
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

    const checkedKingPosition = useMemo<BoardPosition | null>(() => {
        const whiteInCheck = IsKingInCheck({
            color: "white",
            pieces,
        });

        if (whiteInCheck) {
            const whiteKing = pieces.find(
                (piece) => piece.type === "king" && piece.color === "white",
            );

            if (whiteKing) {
                return {
                    row: whiteKing.row,
                    column: whiteKing.column,
                };
            }
        }

        const blackInCheck = IsKingInCheck({
            color: "black",
            pieces,
        });

        if (blackInCheck) {
            const blackKing = pieces.find(
                (piece) => piece.type === "king" && piece.color === "black",
            );

            if (blackKing) {
                return {
                    row: blackKing.row,
                    column: blackKing.column,
                };
            }
        }

        return null;
    }, [pieces]);

    const gameState = useMemo<GameState>(() => {
        const currentPlayerCheckmate = isCheckmate({
            color: currentTurn,
            pieces,
            getLegalMovesUseCase,
        });

        if (currentPlayerCheckmate) {
            const winner: ChessTurn =
                currentTurn === "white" ? "black" : "white";

            return {
                status: "checkmate",
                winner,
            };
        }
        const currentPlayerStalemate = IsStalemate({
            color: currentTurn,
            pieces,
            getLegalMovesUseCase,
        });

        if (currentPlayerStalemate) {
            return {
                status: "stalemate",
                winner: null,
            };
        }
        const currentPlayerInCheck = IsKingInCheck({
            color: currentTurn,
            pieces,
        });

        if (currentPlayerInCheck) {
            return {
                status: "check",
                winner: null,
            };
        }

        return {
            status: "playing",
            winner: null,
        };
    }, [pieces, currentTurn, getLegalMovesUseCase]);
    const handleSquarePress = (row: number, column: number) => {
        if (gameState.status === "checkmate" || gameState.status === "stalemate" ) {
            return;
        }
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

        const isValidMove = validMoves.some(
            (move) => move.row === row && move.column === column,
        );

        if (!isValidMove) {
            return;
        }

        if (!selectedPieceId) {
            return;
        }

        const updatedPieces = movePieceUseCase.execute({
            pieces,
            pieceId: selectedPieceId,
            target: {
                row,
                column,
            },
        });

        setPieces(updatedPieces);

        setCurrentTurn((previousTurn) =>
            previousTurn === "white" ? "black" : "white",
        );

        clearSelection();
    };

    const resetGame = () => {
        setPieces(initialChessPieces);

        setCurrentTurn("white");

        clearSelection();
    };
    return {
        pieces,
        selectedSquare,
        selectedPieceId,
        validMoves,
        currentTurn,
        checkedKingPosition,
        gameStatus: gameState.status,
        winner: gameState.winner,
        handleSquarePress,
        resetGame,
    };
}
