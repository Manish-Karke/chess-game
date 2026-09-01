import {
    GetValidMovesInput,
    GetValidMovesUseCase,
} from "./GetValidMovesUseCase";

import { BoardPosition } from "../entities/ChessPiece";
import { getPawnValidMoves } from "../rules/getPawnValidMoves";
import { getKnightValidMoves } from "../rules/getKnightValidMoves";
import { GetRookValidMoves } from "../rules/getRookValidMoves";
import { GetBishopValidMoves } from "../rules/getBishopValidMoves";

export class GetValidMovesUseCaseImpl implements GetValidMovesUseCase {
    execute({ piece, pieces }: GetValidMovesInput): BoardPosition[] {
        switch (piece.type) {
            case "pawn":
                return getPawnValidMoves({
                    piece,
                    pieces,
                });

            case "knight":
                return getKnightValidMoves({
                    piece,
                    pieces,
                });

            case "rook":
                return GetRookValidMoves({
                    piece,
                    pieces,
                });

            case "bishop":
                return GetBishopValidMoves({
                    piece,
                    pieces,
                });

            default:
                return [];
        }
    }
}
