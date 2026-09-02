export type ChessPieceType =
    | "king"
    | "queen"
    | "rook"
    | "bishop"
    | "knight"
    | "pawn";

export type ChessPieceColor = "white" | "black";

export type ChessPiece = {
    id: string;
    type: ChessPieceType;
    color: ChessPieceColor;
    row: number;
    column: number;
        hasMoved: boolean;
};

export type GameStatus = "playing" | "check" | "checkmate" | "stalemate";

export type Winner = "white" | "black" | null;

export type BoardPosition = {
    row: number;
    column: number;
};
export type ChessTurn = "white" | "black";
export type GameState = {
    status: GameStatus;
    winner: ChessTurn | null;
};


export type ChessMove = {
    pieceId: string;
    pieceType: ChessPiece["type"];
    color: ChessPiece["color"];

    from: BoardPosition;
    to: BoardPosition;
};

export type ChessGameMode =
    | "local"
    | "computer";   