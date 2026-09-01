import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type Direction = readonly [number, number];

type GetSlidingMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
    directions: readonly Direction[];
};

export function getSlidingMoves({
    piece,
    pieces,
    directions,
}: GetSlidingMovesInput): BoardPosition[] {
    const validMoves: BoardPosition[] = [];

    for (const [rowDirection, columnDirection] of directions) {
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

            // Empty square
            if (!targetPiece) {
                validMoves.push({
                    row: targetRow,
                    column: targetColumn,
                });

                targetRow += rowDirection;
                targetColumn += columnDirection;

                continue;
            }

            // Enemy piece can be captured
            if (targetPiece.color !== piece.color) {
                validMoves.push({
                    row: targetRow,
                    column: targetColumn,
                });
            }

            // Own or enemy piece blocks anything behind it
            break;
        }
    }

    return validMoves;
}
