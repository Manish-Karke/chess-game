import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

import { getSlidingMoves } from "./getSlidingMoves";

type GetQueenValidMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

const QUEEN_DIRECTIONS = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],

    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
] as const;

export function getQueenValidMoves({
    piece,
    pieces,
}: GetQueenValidMovesInput): BoardPosition[] {
    return getSlidingMoves({
        piece,
        pieces,
        directions: QUEEN_DIRECTIONS,
    });
}
