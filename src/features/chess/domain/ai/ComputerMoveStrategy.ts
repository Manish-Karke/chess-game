import { ChessMove, ChessPiece } from "../entities/ChessPiece";

export type ComputerMoveStrategyInput = {
    pieces: ChessPiece[];
    color: ChessPiece["color"];
    lastMove: ChessMove | null;
};

export interface ComputerMoveStrategy {
    chooseMove(input: ComputerMoveStrategyInput): ChessMove | null;
}
