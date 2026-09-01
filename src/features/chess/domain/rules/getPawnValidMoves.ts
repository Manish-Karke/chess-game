import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type GetPawnValidMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

export function getPawnValidMoves({ piece, pieces }: GetPawnValidMovesInput) {
    const moves: BoardPosition[] = [];
    const direction = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;
    const oneStepRow = piece.row + direction;

    const onestepBlocked = pieces.some(
        (item) => item.row === oneStepRow && item.column === piece.column,
    );

    if (!onestepBlocked) {
        moves.push({
            row: oneStepRow,
            column: piece.column,
        });
        const twoStepRow = piece.row + direction * 2;
        const twoStepBlocked = pieces.some(
            (item) => item.row === twoStepRow && item.column === piece.column,
        );
        if (piece.row === startRow && !twoStepBlocked) {
            moves.push({
                row: twoStepRow,
                column: piece.column,
            });
        }
    }

    return moves;
}
