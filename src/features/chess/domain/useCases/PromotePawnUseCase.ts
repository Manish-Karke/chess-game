import { ChessPiece } from "../entities/ChessPiece";

export type PromotionPieceType =
    | "queen"
    | "rook"
    | "bishop"
    | "knight";


export type PromotePawnInput = {
    pieces: ChessPiece[];
    pieceId: string;
    promoteTo: PromotionPieceType;
};

export interface PromotePawnUseCase {
    execute(
        input: PromotePawnInput,
    ): ChessPiece[];
}