import {
    BoardPosition,
    ChessPiece,
} from "../entities/ChessPiece";

export type GetLegalMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

export interface GetLegalMovesUseCase {
    execute(
        input: GetLegalMovesInput,
    ): BoardPosition[];
}