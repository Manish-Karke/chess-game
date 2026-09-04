import KnightIcon from "../../presentation/icons/KnightIcon";
import { ChessPiece } from "../entities/ChessPiece";

const PIECE_VALUES: Record<ChessPiece["type"], number>={
    pawn:1,
    knight:3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0,
}

export function calculateMaterialScore(
    pieces: ChessPiece[],
    color: ChessPiece["color"],
): number {
    return pieces
        .filter((piece) => piece.color === color)
        .reduce(
            (total, piece) =>
                total + PIECE_VALUES[piece.type],
            0,
        );
}