// domain/constants/pieceValues.ts

import { ChessPiece } from "../entities/ChessPiece";

export const PIECE_VALUES: Record<
    ChessPiece["type"],
    number
> = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0,
};