// import { ChessMove, ChessPiece } from "../entities/ChessPiece";

// import {
//     ComputerMoveStrategy,
//     ComputerMoveStrategyInput,
// } from "./ComputerMoveStrategy";

// import { GetLegalMovesUseCase } from "../useCases/GetLegalMovesUseCase";

// import { getAllLegalMoves } from "./getAllLegalMoves";
// import { evaluateBoard } from "./evaluateBoard";

// import { IsKingInCheck } from "../rules/iskingInCheck";
// import { applyMoveToPieces } from "../rules/applyMoveToPieces";

// const CHECKMATE_SCORE = 100_000;

// export class HardComputerStrategy implements ComputerMoveStrategy {
//     private readonly searchDepth = 2;

//     constructor(private readonly getLegalMovesUseCase: GetLegalMovesUseCase) {}

//     chooseMove({
//         pieces,
//         color,
//         lastMove,
//     }: ComputerMoveStrategyInput): ChessMove | null {
//         const legalMoves = getAllLegalMoves({
//             pieces,
//             color,
//             lastMove,

//             getLegalMovesUseCase: this.getLegalMovesUseCase,
//         });

//         if (legalMoves.length === 0) {
//             return null;
//         }

//         let bestMove: ChessMove | null = null;

//         let bestScore = -Infinity;

//         let alpha = -Infinity;
//         const beta = Infinity;

//         for (const move of legalMoves) {
//             const simulatedPieces = this.applySearchMove(
//                 pieces,
//                 move,
//                 lastMove,
//             );

//             const opponentColor = this.oppositeColor(color);

//             const score = this.minimax({
//                 pieces: simulatedPieces,

//                 depth: this.searchDepth - 1,

//                 currentColor: opponentColor,

//                 computerColor: color,

//                 lastMove: move,

//                 alpha,

//                 beta,

//                 maximizing: false,
//             });

//             if (score > bestScore) {
//                 bestScore = score;
//                 bestMove = move;
//             }

//             alpha = Math.max(alpha, bestScore);
//         }

//         return bestMove;
//     }

//     private minimax({
//         pieces,
//         depth,
//         currentColor,
//         computerColor,
//         lastMove,
//         alpha,
//         beta,
//         maximizing,
//     }: {
//         pieces: ChessPiece[];
//         depth: number;

//         currentColor: ChessPiece["color"];

//         computerColor: ChessPiece["color"];

//         lastMove: ChessMove | null;

//         alpha: number;
//         beta: number;

//         maximizing: boolean;
//     }): number {
//         const legalMoves = getAllLegalMoves({
//             pieces,
//             color: currentColor,

//             lastMove,

//             getLegalMovesUseCase: this.getLegalMovesUseCase,
//         });

//         if (legalMoves.length === 0) {
//             return this.evaluateTerminalPosition({
//                 pieces,
//                 currentColor,
//                 computerColor,
//                 depth,
//             });
//         }

//         if (depth === 0) {
//             return evaluateBoard({
//                 pieces,
//                 computerColor,
//             });
//         }

//         if (maximizing) {
//             let bestScore = -Infinity;

//             for (const move of legalMoves) {
//                 const simulatedPieces = this.applySearchMove(
//                     pieces,
//                     move,
//                     lastMove,
//                 );

//                 const score = this.minimax({
//                     pieces: simulatedPieces,

//                     depth: depth - 1,

//                     currentColor: this.oppositeColor(currentColor),

//                     computerColor,

//                     lastMove: move,

//                     alpha,

//                     beta,

//                     maximizing: false,
//                 });

//                 bestScore = Math.max(bestScore, score);

//                 alpha = Math.max(alpha, bestScore);

//                 if (beta <= alpha) {
//                     break;
//                 }
//             }

//             return bestScore;
//         }

//         let bestScore = Infinity;

//         for (const move of legalMoves) {
//             const simulatedPieces = this.applySearchMove(
//                 pieces,
//                 move,
//                 lastMove,
//             );

//             const score = this.minimax({
//                 pieces: simulatedPieces,

//                 depth: depth - 1,

//                 currentColor: this.oppositeColor(currentColor),

//                 computerColor,

//                 lastMove: move,

//                 alpha,

//                 beta,

//                 maximizing: true,
//             });

//             bestScore = Math.min(bestScore, score);

//             beta = Math.min(beta, bestScore);

//             if (beta <= alpha) {
//                 break;
//             }
//         }

//         return bestScore;
//     }

//     private evaluateTerminalPosition({
//         pieces,
//         currentColor,
//         computerColor,
//         depth,
//     }: {
//         pieces: ChessPiece[];

//         currentColor: ChessPiece["color"];

//         computerColor: ChessPiece["color"];

//         depth: number;
//     }): number {
//         const inCheck = IsKingInCheck({
//             color: currentColor,

//             pieces,
//         });

//         // No legal move + not check
//         // = stalemate.
//         if (!inCheck) {
//             return 0;
//         }

//         // Current player is checkmated.
//         if (currentColor === computerColor) {
//             return -CHECKMATE_SCORE - depth;
//         }

//         return CHECKMATE_SCORE + depth;
//     }

//     private applySearchMove(
//         pieces: ChessPiece[],
//         move: ChessMove,
//         lastMove: ChessMove | null,
//     ): ChessPiece[] {
//         let updatedPieces = applyMoveToPieces({
//             pieces,
//             pieceId: move.pieceId,

//             target: move.to,

//             lastMove,
//         });

//         updatedPieces = updatedPieces.map((piece) => {
//             if (piece.id !== move.pieceId) {
//                 return piece;
//             }

//             if (piece.type !== "pawn") {
//                 return piece;
//             }

//             const promotionRow = piece.color === "white" ? 0 : 7;

//             if (piece.row !== promotionRow) {
//                 return piece;
//             }

//             return {
//                 ...piece,
//                 type: "queen",
//             };
//         });

//         return updatedPieces;
//     }

//     private oppositeColor(color: ChessPiece["color"]): ChessPiece["color"] {
//         return color === "white" ? "black" : "white";
//     }
// }
import { ChessMove, ChessPiece } from "../entities/ChessPiece";

import {
    ComputerMoveStrategy,
    ComputerMoveStrategyInput,
} from "./ComputerMoveStrategy";

import { GetLegalMovesUseCase } from "../useCases/GetLegalMovesUseCase";

import { getAllLegalMoves } from "./getAllLegalMoves";
import { evaluateBoard } from "./evaluateBoard";

import { IsKingInCheck } from "../rules/iskingInCheck";
import { applyMoveToPieces } from "../rules/applyMoveToPieces";

const CHECKMATE_SCORE = 100_000;

const PIECE_VALUES: Record<ChessPiece["type"], number> = {
    pawn: 100,
    knight: 320,
    bishop: 330,
    rook: 500,
    queen: 900,
    king: 0,
};

export class HardComputerStrategy implements ComputerMoveStrategy {
    private readonly searchDepth = 2;

    // Hard should not think forever.
    private readonly maxThinkingTimeMs = 1500;

    private deadline = 0;

    constructor(private readonly getLegalMovesUseCase: GetLegalMovesUseCase) {}

    chooseMove({
        pieces,
        color,
        lastMove,
    }: ComputerMoveStrategyInput): ChessMove | null {
        const startedAt = Date.now();

        this.deadline = startedAt + this.maxThinkingTimeMs;

        let legalMoves = getAllLegalMoves({
            pieces,
            color,
            lastMove,

            getLegalMovesUseCase: this.getLegalMovesUseCase,
        });

        if (legalMoves.length === 0) {
            return null;
        }

        // Important for alpha-beta performance.
        legalMoves = this.orderMoves(legalMoves, pieces);

        // Always have a fallback.
        let bestMove: ChessMove = legalMoves[0];

        let bestScore = -Infinity;

        let alpha = -Infinity;
        const beta = Infinity;

        for (const move of legalMoves) {
            // Stop searching when time is over.
            if (this.isTimeUp()) {
                break;
            }

            const simulatedPieces = this.applySearchMove(
                pieces,
                move,
                lastMove,
            );

            const opponentColor = this.oppositeColor(color);

            const score = this.minimax({
                pieces: simulatedPieces,

                depth: this.searchDepth - 1,

                currentColor: opponentColor,

                computerColor: color,

                lastMove: move,

                alpha,
                beta,

                maximizing: false,
            });

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }

            alpha = Math.max(alpha, bestScore);
        }

        console.log("[HARD AI]", {
            time: Date.now() - startedAt,
            bestScore,
            bestMove,
        });

        return bestMove;
    }

    private minimax({
        pieces,
        depth,
        currentColor,
        computerColor,
        lastMove,
        alpha,
        beta,
        maximizing,
    }: {
        pieces: ChessPiece[];
        depth: number;

        currentColor: ChessPiece["color"];

        computerColor: ChessPiece["color"];

        lastMove: ChessMove | null;

        alpha: number;
        beta: number;

        maximizing: boolean;
    }): number {
        // --------------------------------
        // VERY IMPORTANT OPTIMIZATION
        // --------------------------------

        if (depth === 0 || this.isTimeUp()) {
            return evaluateBoard({
                pieces,
                computerColor,
            });
        }

        // Only generate moves when
        // we are actually searching deeper.
        let legalMoves = getAllLegalMoves({
            pieces,
            color: currentColor,

            lastMove,

            getLegalMovesUseCase: this.getLegalMovesUseCase,
        });

        // Checkmate / stalemate.
        if (legalMoves.length === 0) {
            return this.evaluateTerminalPosition({
                pieces,
                currentColor,
                computerColor,
                depth,
            });
        }

        legalMoves = this.orderMoves(legalMoves, pieces);

        if (maximizing) {
            let bestScore = -Infinity;

            for (const move of legalMoves) {
                if (this.isTimeUp()) {
                    break;
                }

                const simulatedPieces = this.applySearchMove(
                    pieces,
                    move,
                    lastMove,
                );

                const score = this.minimax({
                    pieces: simulatedPieces,

                    depth: depth - 1,

                    currentColor: this.oppositeColor(currentColor),

                    computerColor,

                    lastMove: move,

                    alpha,
                    beta,

                    maximizing: false,
                });

                bestScore = Math.max(bestScore, score);

                alpha = Math.max(alpha, bestScore);

                // Alpha-beta pruning
                if (beta <= alpha) {
                    break;
                }
            }

            // Could happen if time expired
            // immediately.
            if (bestScore === -Infinity) {
                return evaluateBoard({
                    pieces,
                    computerColor,
                });
            }

            return bestScore;
        }

        let bestScore = Infinity;

        for (const move of legalMoves) {
            if (this.isTimeUp()) {
                break;
            }

            const simulatedPieces = this.applySearchMove(
                pieces,
                move,
                lastMove,
            );

            const score = this.minimax({
                pieces: simulatedPieces,

                depth: depth - 1,

                currentColor: this.oppositeColor(currentColor),

                computerColor,

                lastMove: move,

                alpha,
                beta,

                maximizing: true,
            });

            bestScore = Math.min(bestScore, score);

            beta = Math.min(beta, bestScore);

            // Alpha-beta pruning
            if (beta <= alpha) {
                break;
            }
        }

        if (bestScore === Infinity) {
            return evaluateBoard({
                pieces,
                computerColor,
            });
        }

        return bestScore;
    }

    private orderMoves(moves: ChessMove[], pieces: ChessPiece[]): ChessMove[] {
        return [...moves].sort(
            (a, b) =>
                this.getMovePriority(b, pieces) -
                this.getMovePriority(a, pieces),
        );
    }

    private getMovePriority(move: ChessMove, pieces: ChessPiece[]): number {
        const capturedPiece = pieces.find(
            (piece) =>
                piece.row === move.to.row && piece.column === move.to.column,
        );

        if (!capturedPiece) {
            return 0;
        }

        return PIECE_VALUES[capturedPiece.type];
    }

    private isTimeUp(): boolean {
        return Date.now() >= this.deadline;
    }

    private evaluateTerminalPosition({
        pieces,
        currentColor,
        computerColor,
        depth,
    }: {
        pieces: ChessPiece[];

        currentColor: ChessPiece["color"];

        computerColor: ChessPiece["color"];

        depth: number;
    }): number {
        const inCheck = IsKingInCheck({
            color: currentColor,

            pieces,
        });

        // Stalemate
        if (!inCheck) {
            return 0;
        }

        // Computer checkmated
        if (currentColor === computerColor) {
            return -CHECKMATE_SCORE - depth;
        }

        // Opponent checkmated
        return CHECKMATE_SCORE + depth;
    }

    private applySearchMove(
        pieces: ChessPiece[],
        move: ChessMove,
        lastMove: ChessMove | null,
    ): ChessPiece[] {
        let updatedPieces = applyMoveToPieces({
            pieces,

            pieceId: move.pieceId,

            target: move.to,

            lastMove,
        });

        // AI assumes Queen promotion.
        updatedPieces = updatedPieces.map((piece) => {
            if (piece.id !== move.pieceId) {
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

        return updatedPieces;
    }

    private oppositeColor(color: ChessPiece["color"]): ChessPiece["color"] {
        return color === "white" ? "black" : "white";
    }
}
