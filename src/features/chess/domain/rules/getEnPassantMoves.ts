import { BoardPosition, ChessMove, ChessPiece } from "../entities/ChessPiece";

type GetEnPassantMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
    lastMove: ChessMove | null;
};

export function getEnPassantMoves({
    piece,
    pieces,
    lastMove,
}: GetEnPassantMovesInput): BoardPosition[] {
    if (piece.type !== "pawn") {
        return [];
    }

    if (!lastMove) {
        return [];
    }

    // Last move must have been made by an opponent pawn.
    if (lastMove.pieceType !== "pawn" || lastMove.color === piece.color) {
        return [];
    }

    // Opponent pawn must have moved exactly 2 rows.
    const movedTwoSquares = Math.abs(lastMove.to.row - lastMove.from.row) === 2;

    if (!movedTwoSquares) {
        return [];
    }

    // White can en passant from row 3.
    // Black can en passant from row 4.
    const requiredRow = piece.color === "white" ? 3 : 4;

    if (piece.row !== requiredRow) {
        return [];
    }

    const lastMovedPawn = pieces.find((item) => item.id === lastMove.pieceId);

    if (!lastMovedPawn) {
        return [];
    }

    // The opponent pawn must now be directly beside this pawn.
    const isBesidePawn =
        lastMovedPawn.row === piece.row &&
        Math.abs(lastMovedPawn.column - piece.column) === 1;

    if (!isBesidePawn) {
        return [];
    }

    const direction = piece.color === "white" ? -1 : 1;

    const target: BoardPosition = {
        row: piece.row + direction,
        column: lastMovedPawn.column,
    };

    // Destination must be empty.
    const targetOccupied = pieces.some(
        (item) => item.row === target.row && item.column === target.column,
    );

    if (targetOccupied) {
        return [];
    }

    return [target];
}
