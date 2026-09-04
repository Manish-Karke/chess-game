import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type GetPawnValidMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

export function getPawnValidMoves({
    piece,
    pieces,
}: GetPawnValidMovesInput): BoardPosition[] {
    const moves: BoardPosition[] = [];

    const direction = piece.color === "white" ? -1 : 1;

    const startRow = piece.color === "white" ? 6 : 1;

    const isInsideBoard = (row: number, column: number): boolean =>
        row >= 0 && row < 8 && column >= 0 && column < 8;

    const getPieceAt = (row: number, column: number): ChessPiece | undefined =>
        pieces.find((item) => item.row === row && item.column === column);

    // --------------------------------
    // 1. One square forward
    // --------------------------------

    const oneStepRow = piece.row + direction;

    const oneStepPiece = getPieceAt(oneStepRow, piece.column);

    if (isInsideBoard(oneStepRow, piece.column) && !oneStepPiece) {
        moves.push({
            row: oneStepRow,
            column: piece.column,
        });

        // --------------------------------
        // 2. Two squares from initial row
        // --------------------------------

        const twoStepRow = piece.row + direction * 2;

        const twoStepPiece = getPieceAt(twoStepRow, piece.column);

        if (
            piece.row === startRow &&
            isInsideBoard(twoStepRow, piece.column) &&
            !twoStepPiece
        ) {
            moves.push({
                row: twoStepRow,
                column: piece.column,
            });
        }
    }

    // --------------------------------
    // 3. Diagonal capture LEFT
    // --------------------------------

    const captureRow = piece.row + direction;

    const leftColumn = piece.column - 1;

    if (isInsideBoard(captureRow, leftColumn)) {
        const leftPiece = getPieceAt(captureRow, leftColumn);

        if (leftPiece && leftPiece.color !== piece.color) {
            moves.push({
                row: captureRow,
                column: leftColumn,
            });
        }
    }

    // --------------------------------
    // 4. Diagonal capture RIGHT
    // --------------------------------

    const rightColumn = piece.column + 1;

    if (isInsideBoard(captureRow, rightColumn)) {
        const rightPiece = getPieceAt(captureRow, rightColumn);

        if (rightPiece && rightPiece.color !== piece.color) {
            moves.push({
                row: captureRow,
                column: rightColumn,
            });
        }
    }

    return moves;
}
