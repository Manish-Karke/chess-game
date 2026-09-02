// domain/useCases/GetLegalMovesUseCaseImpl.ts

import { BoardPosition } from "../entities/ChessPiece";
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
        const candidateMoves = this.getValidMovesUseCase.execute({
            piece,
            pieces,
        });

        return candidateMoves.filter((target) => {
            const targetPiece = pieces.find(
                (item) =>
                    item.row === target.row && item.column === target.column,
            );

            // A king can be attacked/checkmated,
            // but never captured.
            if (targetPiece?.type === "king") {
                return false;
            }

            const simulatedPieces = simulateMove({
                pieces,
                pieceId: piece.id,
                target,
            });

            const leavesKingInCheck = IsKingInCheck({
                color: piece.color,
                pieces: simulatedPieces,
            });

            return !leavesKingInCheck;
        });
    }
}
