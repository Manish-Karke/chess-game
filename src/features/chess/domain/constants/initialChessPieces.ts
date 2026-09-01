import type { ChessPiece } from "../entities/ChessPiece";

export const initialChessPieces: ChessPiece[] = [
    // Black back row
    { id: "black-rook-1", type: "rook", color: "black", row: 0, column: 0 },
    { id: "black-knight-1", type: "knight", color: "black", row: 0, column: 1 },
    { id: "black-bishop-1", type: "bishop", color: "black", row: 0, column: 2 },
    { id: "black-queen", type: "queen", color: "black", row: 0, column: 3 },
    { id: "black-king", type: "king", color: "black", row: 0, column: 4 },
    { id: "black-bishop-2", type: "bishop", color: "black", row: 0, column: 5 },
    { id: "black-knight-2", type: "knight", color: "black", row: 0, column: 6 },
    { id: "black-rook-2", type: "rook", color: "black", row: 0, column: 7 },
    // Black pawns
    ...Array.from(
        { length: 8 },
        (_, column): ChessPiece => ({
            id: `black-pawn-${column + 1}`,
            type: "pawn",
            color: "black",
            row: 1,
            column,
        }),
    ),

    // White pawns
    ...Array.from(
        { length: 8 },
        (_, column): ChessPiece => ({
            id: `white-pawn-${column + 1}`,
            type: "pawn",
            color: "white",
            row: 6,
            column,
        }),
    ),

    // White back row
    { id: "white-rook-1", type: "rook", color: "white", row: 7, column: 0 },
    { id: "white-knight-1", type: "knight", color: "white", row: 7, column: 1 },
    { id: "white-bishop-1", type: "bishop", color: "white", row: 7, column: 2 },
    { id: "white-queen", type: "queen", color: "white", row: 7, column: 3 },
    { id: "white-king", type: "king", color: "white", row: 7, column: 4 },
    { id: "white-bishop-2", type: "bishop", color: "white", row: 7, column: 5 },
    { id: "white-knight-2", type: "knight", color: "white", row: 7, column: 6 },
    { id: "white-rook-2", type: "rook", color: "white", row: 7, column: 7 },
];
