import {
    BoardPosition,
    ChessMove,
    ChessPiece,
} from "../entities/ChessPiece";


export type MovePieceInput = {
    pieces: ChessPiece[];
    pieceId: string;
    target: BoardPosition;
    lastMove: ChessMove | null;
};

export interface MovePieceUseCase {
    execute(input: MovePieceInput): ChessPiece[];
}