import {
    BoardPosition,
    ChessMove,
    ChessPiece,
} from "../entities/ChessPiece";


export type GetLegalMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
    lastMove: ChessMove | null;
};

export interface GetLegalMovesUseCase {
    execute(
        input: GetLegalMovesInput,
    ): BoardPosition[];
}