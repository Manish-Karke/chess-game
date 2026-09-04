import { tags } from "react-native-svg/lib/typescript/xmlTags";
import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type GetKnightValidMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

const KNIGHT_OFFSETS: ReadonlyArray<readonly [number, number]> = [
    [-2, -1],
    [-2, 1],

    [-1, -2],
    [-1, 2],

    [1, -2],
    [1, 2],

    [2, -1],
    [2, 1],
];

export function getKnightValidMoves({
    piece,
    pieces,
}: GetKnightValidMovesInput): BoardPosition[] {
    const validMoves: BoardPosition[] = [];

    for (const [rowOffset, columnOffset] of KNIGHT_OFFSETS) {
        const targetRow = piece.row + rowOffset;
        const targetColumn = piece.column + columnOffset;

        if (
            targetRow < 0 ||
            targetRow >= 8 ||
            targetColumn < 0 ||
            targetColumn >= 8
        ) {
            continue;
        }

        const targetPiece = pieces.find(
            (item) => item.row === targetRow && item.column === targetColumn,
        );

        //can't land over the same color pieces

        if (targetPiece?.color === piece.color) {
            continue;
        }

        validMoves.push({
            row: targetRow,
            column: targetColumn,
        });
    }

    return validMoves;
}
