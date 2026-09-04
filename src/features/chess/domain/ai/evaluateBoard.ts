import { ChessPiece } from "../entities/ChessPiece";

const PIECE_VALUES: Record<
    ChessPiece["type"],
    number
> = {
    pawn: 100,
    knight: 320,
    bishop: 330,
    rook: 500,
    queen: 900,
    king: 0,
};

type EvaluateBoardInput = {
    pieces: ChessPiece[];
    computerColor: ChessPiece["color"];
};

export function evaluateBoard({
    pieces,
    computerColor,
}: EvaluateBoardInput): number {
    let score = 0;

    for (const piece of pieces) {
        const materialValue =
            PIECE_VALUES[piece.type];

        const positionalValue =
            getPositionalValue(piece);

        const totalValue =
            materialValue +
            positionalValue;

        if (piece.color === computerColor) {
            score += totalValue;
        } else {
            score -= totalValue;
        }
    }

    return score;
}

function getPositionalValue(
    piece: ChessPiece,
): number {
    const distanceFromCenter =
        Math.abs(3.5 - piece.row) +
        Math.abs(3.5 - piece.column);

    const centerBonus =
        Math.max(
            0,
            4 - distanceFromCenter,
        );

    switch (piece.type) {
        case "knight":
            return centerBonus * 8;

        case "bishop":
            return centerBonus * 5;

        case "queen":
            return centerBonus * 2;

        case "pawn":
            return centerBonus * 2;

        default:
            return 0;
    }
}