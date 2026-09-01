import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type GetKingValidMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

const KING_OFFSETS: ReadonlyArray<readonly [number, number]> = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],

    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
];

export function getKingValidMoves({
    piece,
    pieces,
}: GetKingValidMovesInput): BoardPosition[] {
    const validMoves: BoardPosition[] = [];

    for (const [rowOffset, columnOffset] of KING_OFFSETS) {
        const targetRow = piece.row + rowOffset;
        const targetColumn = piece.column + columnOffset;

        const isInsideBoard =
            targetRow >= 0 &&
            targetRow < 8 &&
            targetColumn >= 0 &&
            targetColumn < 8;

        if (!isInsideBoard) {
            continue;
        }

        const targetPiece = pieces.find(
            (item) => item.row === targetRow && item.column === targetColumn,
        );

        // King cannot land on its own piece
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
