import { ChessMove, ChessPiece } from "../entities/ChessPiece";

import { GetLegalMovesUseCase } from "../useCases/GetLegalMovesUseCase";

import {
    ComputerMoveStrategy,
    ComputerMoveStrategyInput,
} from "./ComputerMoveStrategy";

import { getAllLegalMoves } from "./getAllLegalMoves";
import { evaluateBoard } from "./evaluateBoard";

import { IsKingInCheck } from "../rules/iskingInCheck";
import { applyMoveToPieces } from "../rules/applyMoveToPieces";

export class MediumComputerStrategy implements ComputerMoveStrategy {
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

        let bestMove: ChessMove | null = null;

        let bestScore = -Infinity;

        for (const move of legalMoves) {
            let simulatedPieces = applyMoveToPieces({
                pieces,
                pieceId: move.pieceId,

                target: move.to,

                lastMove,
            });

            simulatedPieces = promotePawnIfNeeded({
                pieces: simulatedPieces,

                pieceId: move.pieceId,
            });

            let score = evaluateBoard({
                pieces: simulatedPieces,

                computerColor: color,
            });

            const opponentColor = color === "white" ? "black" : "white";

            const givesCheck = IsKingInCheck({
                color: opponentColor,

                pieces: simulatedPieces,
            });

            if (givesCheck) {
                score += 40;
            }

            // Tiny randomness avoids
            // identical play every game.
            score += Math.random() * 10;

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        return bestMove;
    }
}

function promotePawnIfNeeded({
    pieces,
    pieceId,
}: {
    pieces: ChessPiece[];
    pieceId: string;
}): ChessPiece[] {
    return pieces.map((piece) => {
        if (piece.id !== pieceId) {
            return piece;
        }

        if (piece.type !== "pawn") {
            return piece;
        }

        const promotionRow = piece.color === "white" ? 0 : 7;

        if (piece.row !== promotionRow) {
            return piece;
        }

        return {
            ...piece,
            type: "queen",
        };
    });
}
