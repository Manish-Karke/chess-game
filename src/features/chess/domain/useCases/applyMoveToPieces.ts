// import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

// type ApplyMoveToPiecesInput = {
//     pieces: ChessPiece[];
//     pieceId: string;
//     target: BoardPosition;
// };

// export function applyMoveToPieces({
//     pieces,
//     pieceId,
//     target,
// }: ApplyMoveToPiecesInput): ChessPiece[] {
//     const movingPiece = pieces.find((piece) => piece.id === pieceId);

//     if (!movingPiece) {
//         return pieces;
//     }

//     const targetPiece = pieces.find(
//         (piece) => piece.row === target.row && piece.column === target.column,
//     );

//     // Never capture a king
//     if (targetPiece?.type === "king") {
//         return pieces;
//     }

//     // Never capture own piece
//     if (targetPiece && targetPiece.color === movingPiece.color) {
//         return pieces;
//     }

//     const isCastling =
//         movingPiece.type === "king" &&
//         movingPiece.row === target.row &&
//         Math.abs(target.column - movingPiece.column) === 2;

//     const isKingSide = target.column > movingPiece.column;

//     const rookStartColumn = isKingSide ? 7 : 0;

//     const rookTargetColumn = isKingSide ? 5 : 3;

//     // Defensive check:
//     // if this looks like castling, rook must exist.
//     if (isCastling) {
//         const rook = pieces.find(
//             (piece) =>
//                 piece.type === "rook" &&
//                 piece.color === movingPiece.color &&
//                 piece.row === movingPiece.row &&
//                 piece.column === rookStartColumn,
//         );

//         if (!rook) {
//             return pieces;
//         }
//     }

//     return pieces
//         .filter((piece) => {
//             if (!targetPiece) {
//                 return true;
//             }
//             return piece.id !== targetPiece.id;
//         })
//         .map((piece) => {
//             // Move selected piece
//             if (piece.id === movingPiece.id) {
//                 return {
//                     ...piece,
//                     row: target.row,
//                     column: target.column,
//                     hasMoved: true,
//                 };
//             }
//             if (
//                 isCastling &&
//                 piece.type === "rook" &&
//                 piece.color === movingPiece.color &&
//                 piece.row === movingPiece.row &&
//                 piece.column === rookStartColumn
//             ) {
//                 return {
//                     ...piece,
//                     column: rookTargetColumn,
//                     hasMoved: true,
//                 };
//             }

//             return piece;
//         });
// }
import { BoardPosition, ChessMove, ChessPiece } from "../entities/ChessPiece";


type ApplyMoveToPiecesInput = {
    pieces: ChessPiece[];
    pieceId: string;
    target: BoardPosition;
    lastMove: ChessMove | null;
};

export function applyMoveToPieces({
    pieces,
    pieceId,
    target,
    lastMove,
}: ApplyMoveToPiecesInput): ChessPiece[] {
    const movingPiece = pieces.find((piece) => piece.id === pieceId);

    if (!movingPiece) {
        return pieces;
    }

    const targetPiece = pieces.find(
        (piece) => piece.row === target.row && piece.column === target.column,
    );

    // Never capture a king.
    if (targetPiece?.type === "king") {
        return pieces;
    }

    // Never capture own piece.
    if (targetPiece && targetPiece.color === movingPiece.color) {
        return pieces;
    }

    // -----------------------------------
    // CASTLING
    // -----------------------------------

    const isCastling =
        movingPiece.type === "king" &&
        movingPiece.row === target.row &&
        Math.abs(target.column - movingPiece.column) === 2;

    const isKingSide = target.column > movingPiece.column;

    const rookStartColumn = isKingSide ? 7 : 0;

    const rookTargetColumn = isKingSide ? 5 : 3;

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

    // -----------------------------------
    // EN PASSANT
    // -----------------------------------

    const pawnDirection = movingPiece.color === "white" ? -1 : 1;

    const lastMovedPiece = lastMove
        ? pieces.find((piece) => piece.id === lastMove.pieceId)
        : undefined;

    const movedTwoSquares = lastMove
        ? Math.abs(lastMove.to.row - lastMove.from.row) === 2
        : false;

    const isEnPassant =
        movingPiece.type === "pawn" &&
        // En passant destination is empty.
        !targetPiece &&
        // Pawn moves exactly one row forward.
        target.row === movingPiece.row + pawnDirection &&
        // Pawn moves one column diagonally.
        Math.abs(target.column - movingPiece.column) === 1 &&
        // Previous move was an enemy pawn.
        lastMove?.pieceType === "pawn" &&
        lastMove.color !== movingPiece.color &&
        // Previous pawn moved two squares.
        movedTwoSquares &&
        // Previous pawn ended beside this pawn.
        lastMove.to.row === movingPiece.row &&
        lastMove.to.column === target.column &&
        // That pawn still exists beside us.
        lastMovedPiece?.type === "pawn" &&
        lastMovedPiece.row === movingPiece.row &&
        lastMovedPiece.column === target.column;

    const enPassantCapturedPieceId = isEnPassant ? lastMove?.pieceId : null;

    // -----------------------------------
    // APPLY MOVE
    // -----------------------------------

    return pieces
        .filter((piece) => {
            // Normal capture
            if (targetPiece && piece.id === targetPiece.id) {
                return false;
            }

            // En passant capture
            if (
                enPassantCapturedPieceId &&
                piece.id === enPassantCapturedPieceId
            ) {
                return false;
            }

            return true;
        })
        .map((piece) => {
            // Move selected piece.
            if (piece.id === movingPiece.id) {
                return {
                    ...piece,
                    row: target.row,
                    column: target.column,
                    hasMoved: true,
                };
            }

            // Move rook during castling.
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
