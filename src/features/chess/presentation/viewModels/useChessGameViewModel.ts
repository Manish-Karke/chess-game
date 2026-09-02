import { useMemo, useState } from "react";

import { initialChessPieces } from "../../domain/constants/initialChessPieces";
import {
    BoardPosition,
    ChessMove,
    ChessPiece,
    GameState,
} from "../../domain/entities/ChessPiece";

import { GetLegalMovesUseCase } from "../../domain/useCases/GetLegalMovesUseCase";
import { MovePieceUseCase } from "../../domain/useCases/MovePieceUseCase";
import { IsKingInCheck } from "../../domain/rules/iskingInCheck";
import { isCheckmate } from "../../domain/rules/isCheckmate";
import { IsStalemate } from "../../domain/rules/isStalemate";
import {
    PromotePawnUseCase,
    PromotionPieceType,
} from "../../domain/useCases/PromotePawnUseCase";

export type ChessTurn = "white" | "black";

type SelectedSquare = BoardPosition | null;
type PendingPromotion = {
    pieceId: string;
    color: ChessPiece["color"];
} | null;
type UseChessGameViewModelParams = {
    getLegalMovesUseCase: GetLegalMovesUseCase;
    movePieceUseCase: MovePieceUseCase;
    promotePawnUseCase: PromotePawnUseCase;
};

export function useChessGameViewModel({
    getLegalMovesUseCase,
    movePieceUseCase,
    promotePawnUseCase,
}: UseChessGameViewModelParams) {
    const [pieces, setPieces] = useState<ChessPiece[]>(initialChessPieces);

    const [selectedSquare, setSelectedSquare] = useState<SelectedSquare>(null);

    const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);

    const [currentTurn, setCurrentTurn] = useState<ChessTurn>("white");

    const [validMoves, setValidMoves] = useState<BoardPosition[]>([]);

    const [pendingPromotion, setPendingPromotion] =
        useState<PendingPromotion>(null);

    const [lastMove, setLastMove] = useState<ChessMove | null>(null);
    const clearSelection = () => {
        setSelectedPieceId(null);
        setSelectedSquare(null);
        setValidMoves([]);
    };

    const selectPiece = (piece: ChessPiece) => {
        const moves = getLegalMovesUseCase.execute({
            piece,
            pieces,
            lastMove,
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
        if (pendingPromotion) {
            return {
                status: "playing",
                winner: null,
            };
        }

        const currentPlayerCheckmate = isCheckmate({
            color: currentTurn,
            pieces,
            lastMove,
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
            lastMove,
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
    }, [pieces, currentTurn, lastMove, pendingPromotion, getLegalMovesUseCase]);
    const handleSquarePress = (row: number, column: number) => {
        if (
            gameState.status === "checkmate" ||
            gameState.status === "stalemate" ||
            pendingPromotion
        ) {
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

        // if (!selectedPieceId) {
        //     return;
        // }

        // const movingPiece = pieces.find(
        //     (piece) => piece.id === selectedPieceId,
        // );

        // if (!movingPiece) {
        //     return;
        // }

        // const currentMove: ChessMove = {
        //     pieceId: movingPiece.id,
        //     pieceType: movingPiece.type,
        //     color: movingPiece.color,

        //     from: {
        //         row: movingPiece.row,
        //         column: movingPiece.column,
        //     },

        //     to: {
        //         row,
        //         column,
        //     },
        // };
        // // const updatedPieces = movePieceUseCase.execute({
        // //     pieces,
        // //     pieceId: selectedPieceId,
        // //     target: {
        // //         row,
        // //         column,
        // //     },
        // // });
        // const updatedPieces = movePieceUseCase.execute({
        //     pieces,
        //     pieceId: selectedPieceId,
        //     target: {
        //         row,
        //         column,
        //     },
        //     lastMove,
        // });

        // setPieces(updatedPieces);

        // const movedPiece = updatedPieces.find(
        //     (piece) => piece.id === selectedPieceId,
        // );

        // const requiresPromotion =
        //     movedPiece?.type === "pawn" &&
        //     ((movedPiece.color === "white" && movedPiece.row === 0) ||
        //         (movedPiece.color === "black" && movedPiece.row === 7));

        // if (requiresPromotion && movedPiece) {
        //     setPendingPromotion({
        //         pieceId: movedPiece.id,
        //         color: movedPiece.color,
        //     });

        //     clearSelection();

        //     // Very important:
        //     // don't switch turn yet.
        //     return;
        // }

        // setCurrentTurn((previousTurn) =>
        //     previousTurn === "white" ? "black" : "white",
        // );

        // clearSelection();
        if (!selectedPieceId) {
    return;
}

const movingPiece = pieces.find(
    (piece) => piece.id === selectedPieceId,
);

if (!movingPiece) {
    return;
}

// This is the move being made NOW.
const currentMove: ChessMove = {
    pieceId: movingPiece.id,
    pieceType: movingPiece.type,
    color: movingPiece.color,

    from: {
        row: movingPiece.row,
        column: movingPiece.column,
    },

    to: {
        row,
        column,
    },
};

// IMPORTANT:
// `lastMove` here is still the OPPONENT'S previous move.
const updatedPieces = movePieceUseCase.execute({
    pieces,
    pieceId: selectedPieceId,
    target: {
        row,
        column,
    },
    lastMove,
});

setPieces(updatedPieces);

// Only AFTER executing the move,
// currentMove becomes lastMove.
setLastMove(currentMove);

const movedPiece = updatedPieces.find(
    (piece) => piece.id === selectedPieceId,
);

const requiresPromotion =
    movedPiece?.type === "pawn" &&
    (
        (movedPiece.color === "white" &&
            movedPiece.row === 0) ||
        (movedPiece.color === "black" &&
            movedPiece.row === 7)
    );

if (requiresPromotion && movedPiece) {
    setPendingPromotion({
        pieceId: movedPiece.id,
        color: movedPiece.color,
    });

    clearSelection();
    return;
}

setCurrentTurn((previousTurn) =>
    previousTurn === "white"
        ? "black"
        : "white",
);

clearSelection();
    };
    const handlePromotion = (promoteTo: PromotionPieceType) => {
        if (!pendingPromotion) {
            return;
        }

        const promotedPieces = promotePawnUseCase.execute({
            pieces,
            pieceId: pendingPromotion.pieceId,
            promoteTo,
        });

        setPieces(promotedPieces);

        setPendingPromotion(null);

        setCurrentTurn((previousTurn) =>
            previousTurn === "white" ? "black" : "white",
        );

        clearSelection();
    };

    // const resetGame = () => {
    //     setPieces(
    //         initialChessPieces.map((piece) => ({
    //             ...piece,
    //         })),
    //     );

    //     setCurrentTurn("white");

    //     setPendingPromotion(null);

    //     clearSelection();
    // };
    const resetGame = () => {
        setPieces(
            initialChessPieces.map((piece) => ({
                ...piece,
            })),
        );

        setCurrentTurn("white");
        setPendingPromotion(null);
        setLastMove(null);

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

        pendingPromotion,

        handleSquarePress,
        handlePromotion,
        resetGame,
    };
}
