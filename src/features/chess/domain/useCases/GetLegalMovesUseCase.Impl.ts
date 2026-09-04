import { BoardPosition } from "../entities/ChessPiece";

import { getCastlingMoves } from "../rules/getCastlingMoves";
import { getEnPassantMoves } from "../rules/getEnPassantMoves";

import { IsKingInCheck } from "../rules/iskingInCheck";
import { simulateMove } from "../rules/simulateMove";

import {
    GetLegalMovesInput,
    GetLegalMovesUseCase,
} from "./GetLegalMovesUseCase";

import { GetValidMovesUseCase } from "./GetValidMovesUseCase";

export class GetLegalMovesUseCaseImpl implements GetLegalMovesUseCase {
    constructor(private readonly getValidMovesUseCase: GetValidMovesUseCase) {}

    execute({ piece, pieces, lastMove }: GetLegalMovesInput): BoardPosition[] {
        const normalMoves = this.getValidMovesUseCase.execute({
            piece,
            pieces,
        });

        const castlingMoves =
            piece.type === "king"
                ? getCastlingMoves({
                      piece,
                      pieces,
                  })
                : [];

        const enPassantMoves =
            piece.type === "pawn"
                ? getEnPassantMoves({
                      piece,
                      pieces,
                      lastMove,
                  })
                : [];

        const candidateMoves = [
            ...normalMoves,
            ...castlingMoves,
            ...enPassantMoves,
        ];

        return candidateMoves.filter((target) => {
            const targetPiece = pieces.find(
                (item) =>
                    item.row === target.row && item.column === target.column,
            );

            // King can never be captured.
            if (targetPiece?.type === "king") {
                return false;
            }

            const simulatedPieces = simulateMove({
                pieces,
                pieceId: piece.id,
                target,
                lastMove,
            });

            const kingStillInCheck = IsKingInCheck({
                color: piece.color,
                pieces: simulatedPieces,
            });

            return !kingStillInCheck;
        });
    }
}
