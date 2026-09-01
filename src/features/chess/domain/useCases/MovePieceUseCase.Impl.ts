import {
    MovePieceInput,
    MovePieceUseCase,
} from "./MovePieceUseCase";

import { ChessPiece } from "../entities/ChessPiece";

export class MovePieceUseCaseImpl implements MovePieceUseCase {
    execute({
        pieces,
        pieceId,
        target,
    }: MovePieceInput): ChessPiece[] {

        const targetPiece = pieces.find(
            (piece) =>
                piece.row === target.row &&
                piece.column === target.column,
        );

        const remainingPieces = targetPiece
            ? pieces.filter(
                  (piece) => piece.id !== targetPiece.id,
              )
            : pieces;

        return remainingPieces.map((piece) =>
            piece.id === pieceId
                ? {
                      ...piece,
                      row: target.row,
                      column: target.column,
                  }
                : piece,
        );
    }
}