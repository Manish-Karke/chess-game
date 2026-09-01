import {
  GetValidMovesInput,
  GetValidMovesUseCase,
} from "./GetValidMovesUseCase";

import { BoardPosition } from "../entities/ChessPiece";
import { getPawnValidMoves } from "../rules/getPawnValidMoves";

export class GetValidMovesUseCaseImpl
  implements GetValidMovesUseCase
{
  execute({
    piece,
    pieces,
  }: GetValidMovesInput): BoardPosition[] {
    switch (piece.type) {
      case "pawn":
        return getPawnValidMoves({
          piece,
          pieces,
        });

      default:
        return [];
    }
  }
}