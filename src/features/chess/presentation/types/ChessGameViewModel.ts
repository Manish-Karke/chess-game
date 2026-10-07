import type {
    BoardPosition,
    ChessMove,
    ChessPiece,
} from "../../domain/entities/ChessPiece";

import type {
    PromotionPieceType,
} from "../../domain/useCases/PromotePawnUseCase";

export type ChessTurn = "white" | "black";

export type PendingPromotion = {
    pieceId: string;
    color: ChessPiece["color"];
} | null;

export type ChessGameViewModel = {
    pieces: ChessPiece[];
    selectedSquare: BoardPosition | null;
    selectedPieceId: string | null;
    validMoves: BoardPosition[];
    currentTurn: ChessTurn;
    lastMove: ChessMove | null;
    checkedKingPosition: BoardPosition | null;
    gameStatus:
        | "playing"
        | "check"
        | "checkmate"
        | "stalemate";

    winner: ChessTurn | null;
    pendingPromotion: PendingPromotion;
    piecesCapturedByWhite: ChessPiece[];
    piecesCapturedByBlack: ChessPiece[];
    whiteScore: number;
    blackScore: number;
    handleSquarePress: (
        row: number,
        column: number,
    ) => void;
    handlePromotion: (
        promoteTo: PromotionPieceType,
    ) => void;
    resetGame: () => void;
};