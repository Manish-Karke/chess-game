import { ChessMove } from "../entities/ChessPiece";

import {
    ChooseComputerMoveInput,
    ChooseComputerMoveUseCase,
} from "./ChooseComputerMoveUseCase";

import { GetLegalMovesUseCase } from "./GetLegalMovesUseCase";

export class ChooseComputerMoveUseCaseImpl implements ChooseComputerMoveUseCase {
    constructor(private readonly getLegalMovesUseCase: GetLegalMovesUseCase) {}

    execute({
        pieces,
        color,
        lastMove,
    }: ChooseComputerMoveInput): ChessMove | null {
        const possibleMoves: ChessMove[] = [];

        const computerPieces = pieces.filter((piece) => piece.color === color);

        for (const piece of computerPieces) {
            const legalMoves = this.getLegalMovesUseCase.execute({
                piece,
                pieces,
                lastMove,
            });

            for (const target of legalMoves) {
                possibleMoves.push({
                    pieceId: piece.id,
                    pieceType: piece.type,
                    color: piece.color,

                    from: {
                        row: piece.row,
                        column: piece.column,
                    },

                    to: {
                        row: target.row,
                        column: target.column,
                    },
                });
            }
        }

        if (possibleMoves.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);

        return possibleMoves[randomIndex];
    }
}
