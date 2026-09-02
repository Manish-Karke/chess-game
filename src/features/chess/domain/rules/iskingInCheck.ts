import { ChessPiece } from "../entities/ChessPiece";
import { isSquareAttacked } from "./isSquareAttacked";

type IsKingInCheckInput = {
    color: ChessPiece["color"];
    pieces: ChessPiece[];
};

export function IsKingInCheck({
    color,
    pieces,
}: IsKingInCheckInput): boolean {
    const king = pieces.find(
        (piece) =>
            piece.type === "king" &&
            piece.color === color,
    );

    if (!king) {
        console.log("KING NOT FOUND:", color);
        return false;
    }

    const opponentColor =
        color === "white" ? "black" : "white";

    console.log("CHECKING KING:", {
        color,
        row: king.row,
        column: king.column,
        attackedBy: opponentColor,
    });

    return isSquareAttacked({
        position: {
            row: king.row,
            column: king.column,
        },
        byColor: opponentColor,
        pieces,
    });
}