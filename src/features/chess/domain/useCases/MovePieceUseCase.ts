// MovePieceUseCase.ts

import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

export type MovePieceInput = {
    pieces: ChessPiece[];
    pieceId: string;
    target: BoardPosition;
};

export interface MovePieceUseCase {
    execute(input: MovePieceInput): ChessPiece[];
}