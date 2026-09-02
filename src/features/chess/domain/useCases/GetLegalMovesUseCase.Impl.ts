// domain/useCases/GetLegalMovesUseCaseImpl.ts

import { BoardPosition } from "../entities/ChessPiece";
import { getCastlingMoves } from "../rules/getCastlingMoves";
import { IsKingInCheck } from "../rules/iskingInCheck";
import { simulateMove } from "../rules/simulateMove";

import {
    GetLegalMovesInput,
    GetLegalMovesUseCase,
} from "./GetLegalMovesUseCase";

import { GetValidMovesUseCase } from "./GetValidMovesUseCase";

export class GetLegalMovesUseCaseImpl implements GetLegalMovesUseCase {
    constructor(private readonly getValidMovesUseCase: GetValidMovesUseCase) {}

    execute({ piece, pieces }: GetLegalMovesInput): BoardPosition[] {
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

        const candidateMoves = [...normalMoves, ...castlingMoves];

        return candidateMoves.filter((target) => {
            const targetPiece = pieces.find(
                (item) =>
                    item.row === target.row && item.column === target.column,
            );

            if (targetPiece?.type === "king") {
                return false;
            }

            const simulatedPieces = simulateMove({
                pieces,
                pieceId: piece.id,
                target,
            });

            const kingStillInCheck = IsKingInCheck({
                color: piece.color,
                pieces: simulatedPieces,
            });

            return !kingStillInCheck;
        });
    }
}
