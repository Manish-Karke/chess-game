import { BoardPosition, ChessMove, ChessPiece } from "../entities/ChessPiece";

type GetCapturedPieceForMoveInput = {
    pieces: ChessPiece[];
    pieceId: string;
    target: BoardPosition;
    lastMove: ChessMove | null;
};

export function getCapturedPieceForMove({
    pieces,
    pieceId,
    target,
    lastMove,
}: GetCapturedPieceForMoveInput): ChessPiece | null {
    const movingPiece = pieces.find((piece) => piece.id === pieceId);

    if (!movingPiece) {
        return null;
    }

    const targetPiece = pieces.find(
        (piece) => piece.row === target.row && piece.column === target.column,
    );

    // Normal capture
    if (targetPiece) {
        if (
            targetPiece.color === movingPiece.color ||
            targetPiece.type === "king"
        ) {
            return null;
        }

        return targetPiece;
    }

    // En passant
    if (
        movingPiece.type !== "pawn" ||
        !lastMove ||
        lastMove.pieceType !== "pawn" ||
        lastMove.color === movingPiece.color
    ) {
        return null;
    }

    const lastMovedPiece = pieces.find(
        (piece) => piece.id === lastMove.pieceId,
    );

    if (
        !lastMovedPiece ||
        lastMovedPiece.type !== "pawn" ||
        lastMovedPiece.color === movingPiece.color
    ) {
        return null;
    }

    const pawnDirection = movingPiece.color === "white" ? -1 : 1;

    const isEnPassant =
        target.row === movingPiece.row + pawnDirection &&
        Math.abs(target.column - movingPiece.column) === 1 &&
        Math.abs(lastMove.to.row - lastMove.from.row) === 2 &&
        lastMove.to.row === movingPiece.row &&
        lastMove.to.column === target.column &&
        lastMovedPiece.row === movingPiece.row &&
        lastMovedPiece.column === target.column;

    return isEnPassant ? lastMovedPiece : null;
}
