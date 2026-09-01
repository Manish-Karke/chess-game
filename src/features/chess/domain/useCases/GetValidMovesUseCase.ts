import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

export type GetValidMovesInput = {
    piece: ChessPiece;
    pieces: ChessPiece[];
};

export interface GetValidMovesUseCase {
    execute(input: GetValidMovesInput): BoardPosition[];
}
