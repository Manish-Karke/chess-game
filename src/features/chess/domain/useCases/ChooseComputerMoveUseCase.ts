import {
    ChessMove,
    ChessPiece,
    ComputerDifficulty,
} from "../entities/ChessPiece";


export type ChooseComputerMoveInput = {
    pieces: ChessPiece[];
    color: ChessPiece["color"];
    lastMove: ChessMove | null;

    difficulty: ComputerDifficulty;
};

export interface ChooseComputerMoveUseCase {
    execute(
        input: ChooseComputerMoveInput,
    ): ChessMove | null;
}