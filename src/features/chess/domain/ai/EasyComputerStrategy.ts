import { ChessMove, ChessPiece } from "../entities/ChessPiece";
import { GetLegalMovesUseCase } from "../useCases/GetLegalMovesUseCase";
import {
    ComputerMoveStrategy,
    ComputerMoveStrategyInput,
} from "./ComputerMoveStrategy";
import { getAllLegalMoves } from "./getAllLegalMoves";
const PIECE_VALUES: Record<ChessPiece["type"], number> = {
    pawn: 100,
    knight: 300,
    bishop: 300,
    rook: 500,
    queen: 900,
    king: 0,
};

export class EasyComputerStrategy implements ComputerMoveStrategy {
    constructor(private readonly getLegalMovesUseCase: GetLegalMovesUseCase) {}

    chooseMove({
        pieces,
        color,
        lastMove,
    }: ComputerMoveStrategyInput): ChessMove | null {
        const legalMoves = getAllLegalMoves({
            pieces,
            color,
            lastMove,
            getLegalMovesUseCase: this.getLegalMovesUseCase,
        });

        if (legalMoves.length === 0) {
            return null;
        }

        let bestMove = legalMoves[0];
        let bestScore = -Infinity;

        for (const move of legalMoves) {
            const capturedPiece = pieces.find(
                (piece) =>
                    piece.row === move.to.row &&
                    piece.column === move.to.column,
            );

            const captureScore = capturedPiece
                ? PIECE_VALUES[capturedPiece.type]
                : 0;

            const randomScore = Math.random() * 350;

            const score = captureScore + randomScore;

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove;
    }
}
