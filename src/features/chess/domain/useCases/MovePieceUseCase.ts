import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

export type MovePieceInput = {
    pieces: ChessPiece[];
    placeId: string;
    target: BoardPosition;
};

export interface MovePieceUseCase {
    execute(input: MovePieceInput): ChessPiece[];
}
