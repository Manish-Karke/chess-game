import { ChessPiece } from "../entities/ChessPiece";

const PIECE_VALUES: Record<ChessPiece["type"], number> = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0,
};

export function calculateCapturedMaterialScore(
    capturedPieces: ChessPiece[],
): number {
    return capturedPieces.reduce(
        (total, piece) => total + PIECE_VALUES[piece.type],
        0,
    );
}