import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type GetRookValidMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

const ROOK_DIRECTIONS: ReadonlyArray<readonly [number, number]> = [
    [-1, 0], //up
    [1, 0], //down
    [0, -1], //left
    [0, 1], //right
];

export function GetRookValidMoves({
    piece,
    pieces,
}: GetRookValidMovesInput): BoardPosition[] {
    const validMoves: BoardPosition[] = [];

    for (const [rowDirection, columnDirection] of ROOK_DIRECTIONS) {
        let targetRow = piece.row + rowDirection;
        let targetColumn = piece.column + columnDirection;

        while (
            targetRow >= 0 &&
            targetRow < 8 &&
            targetColumn >= 0 &&
            targetColumn < 8
        ) {
            const targetPiece = pieces.find(
                (item) =>
                    item.row === targetRow && item.column === targetColumn,
            );

            if (!targetPiece) {
                validMoves.push({
                    row: targetRow,
                    column: targetColumn,
                });
                targetRow += rowDirection;
                targetColumn += columnDirection;

                continue;
            }
            if (targetPiece.color !== piece.color) {
                validMoves.push({
                    row: targetRow,
                    column: targetColumn,
                });
            }

            // Own or enemy piece blocks further movement
            break;
        }
    }

    return validMoves;
}
