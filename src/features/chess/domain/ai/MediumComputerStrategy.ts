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

        const opponentColor = color === "white" ? "black" : "white";

        let bestMove: ChessMove | null = null;
        let bestScore = -Infinity;

        for (const move of legalMoves) {
            const nextPieces = promotePawnIfNeeded({
                pieces: applyMoveToPieces({
                    pieces,
                    pieceId: move.pieceId,
                    target: move.to,
                    lastMove,
                }),
                pieceId: move.pieceId,
            });

            // The opponent must respond to this move.
            const opponentReplies = getAllLegalMoves({
                pieces: nextPieces,
                color: opponentColor,
                lastMove: move,
                getLegalMovesUseCase: this.getLegalMovesUseCase,
            });

            let worstReplyScore = Infinity;

            if (opponentReplies.length === 0) {
                // Checkmate is better than any ordinary position.
                const opponentInCheck = IsKingInCheck({
                    pieces: nextPieces,
                    color: opponentColor,
                });

                worstReplyScore = opponentInCheck
                    ? 100_000
                    : evaluateBoard({
                          pieces: nextPieces,
                          computerColor: color,
                      });
            } else {
                for (const reply of opponentReplies) {
                    const replyPieces = promotePawnIfNeeded({
                        pieces: applyMoveToPieces({
                            pieces: nextPieces,
                            pieceId: reply.pieceId,
                            target: reply.to,
                            lastMove: move,
                        }),
                        pieceId: reply.pieceId,
                    });

                    const score = evaluateBoard({
                        pieces: replyPieces,
                        computerColor: color,
                    });

                    worstReplyScore = Math.min(worstReplyScore, score);
                }
            }

            // Keep randomness small and use it only for close scores.
            const score = worstReplyScore;

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
        if (piece.id !== pieceId || piece.type !== "pawn") {
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
