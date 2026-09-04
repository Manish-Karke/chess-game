import { BoardPosition, ChessPiece } from "../entities/ChessPiece";
import { getSlidingMoves } from "./getSlidingMoves";

type GetBishopValidMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

const BISHOP_DIRECTIONS = [
    [-1, -1], // up-left
    [-1, 1], // up-right
    [1, -1], // down-left
    [1, 1], // down-right
] as const;

export function GetBishopValidMoves({
    piece,
    pieces,
}: GetBishopValidMovesInput): BoardPosition[] {
    return getSlidingMoves({
        piece,
        pieces,
        directions:BISHOP_DIRECTIONS,
    });
}
