import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

import { isSquareAttacked } from "./isSquareAttacked";

type GetCastlingMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

export function getCastlingMoves({
    piece,
    pieces,
}: GetCastlingMovesInput): BoardPosition[] {
    if (piece.type !== "king") {
        return [];
    }

    if (piece.hasMoved) {
        return [];
    }

    const homeRow = piece.color === "white" ? 7 : 0;

    // King must still be on original square
    if (piece.row !== homeRow || piece.column !== 4) {
        return [];
    }

    const opponentColor = piece.color === "white" ? "black" : "white";

    const isAttacked = (column: number) =>
        isSquareAttacked({
            position: {
                row: homeRow,
                column,
            },
            byColor: opponentColor,
            pieces,
        });

    // Cannot castle while already in check.
    if (isAttacked(4)) {
        return [];
    }

    const castlingMoves: BoardPosition[] = [];

    // --------------------------
    // KING-SIDE CASTLING
    // --------------------------

    const kingSideRook = pieces.find(
        (item) =>
            item.type === "rook" &&
            item.color === piece.color &&
            item.row === homeRow &&
            item.column === 7,
    );

    if (kingSideRook && !kingSideRook.hasMoved) {
        const pathEmpty = [5, 6].every(
            (column) =>
                !pieces.some(
                    (item) => item.row === homeRow && item.column === column,
                ),
        );

        const pathSafe = !isAttacked(5) && !isAttacked(6);

        if (pathEmpty && pathSafe) {
            castlingMoves.push({
                row: homeRow,
                column: 6,
            });
        }
    }

    // --------------------------
    // QUEEN-SIDE CASTLING
    // --------------------------

    const queenSideRook = pieces.find(
        (item) =>
            item.type === "rook" &&
            item.color === piece.color &&
            item.row === homeRow &&
            item.column === 0,
    );

    if (queenSideRook && !queenSideRook.hasMoved) {
        const pathEmpty = [1, 2, 3].every(
            (column) =>
                !pieces.some(
                    (item) => item.row === homeRow && item.column === column,
                ),
        );

        const pathSafe = !isAttacked(3) && !isAttacked(2);

        if (pathEmpty && pathSafe) {
            castlingMoves.push({
                row: homeRow,
                column: 2,
            });
        }
    }

    return castlingMoves;
}
