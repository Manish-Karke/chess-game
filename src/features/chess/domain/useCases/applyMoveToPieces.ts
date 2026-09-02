import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type ApplyMoveToPiecesInput = {
    pieces: ChessPiece[];
    pieceId: string;
    target: BoardPosition;
};

export function applyMoveToPieces({
    pieces,
    pieceId,
    target,
}: ApplyMoveToPiecesInput): ChessPiece[] {
    const movingPiece = pieces.find((piece) => piece.id === pieceId);

    if (!movingPiece) {
        return pieces;
    }

    const targetPiece = pieces.find(
        (piece) => piece.row === target.row && piece.column === target.column,
    );

    // Never capture a king
    if (targetPiece?.type === "king") {
        return pieces;
    }

    // Never capture own piece
    if (targetPiece && targetPiece.color === movingPiece.color) {
        return pieces;
    }

    const isCastling =
        movingPiece.type === "king" &&
        movingPiece.row === target.row &&
        Math.abs(target.column - movingPiece.column) === 2;

    const isKingSide = target.column > movingPiece.column;

    const rookStartColumn = isKingSide ? 7 : 0;

    const rookTargetColumn = isKingSide ? 5 : 3;

    // Defensive check:
    // if this looks like castling, rook must exist.
    if (isCastling) {
        const rook = pieces.find(
            (piece) =>
                piece.type === "rook" &&
                piece.color === movingPiece.color &&
                piece.row === movingPiece.row &&
                piece.column === rookStartColumn,
        );

        if (!rook) {
            return pieces;
        }
    }

    return pieces
        .filter((piece) => {
            if (!targetPiece) {
                return true;
            }
            return piece.id !== targetPiece.id;
        })
        .map((piece) => {
            // Move selected piece
            if (piece.id === movingPiece.id) {
                return {
                    ...piece,
                    row: target.row,
                    column: target.column,
                    hasMoved: true,
                };
            }
            if (
                isCastling &&
                piece.type === "rook" &&
                piece.color === movingPiece.color &&
                piece.row === movingPiece.row &&
                piece.column === rookStartColumn
            ) {
                return {
                    ...piece,
                    column: rookTargetColumn,
                    hasMoved: true,
                };
            }

            return piece;
        });
}
