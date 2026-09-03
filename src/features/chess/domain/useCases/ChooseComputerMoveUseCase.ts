import { ChessMove, ChessPiece } from "../entities/ChessPiece";

export type ChooseComputerMoveInput = {
    pieces: ChessPiece[];
    color: ChessPiece["color"];
    lastMove: ChessMove | null;
};

export interface ChooseComputerMoveUseCase {
    execute(input: ChooseComputerMoveInput): ChessMove | null;
}
