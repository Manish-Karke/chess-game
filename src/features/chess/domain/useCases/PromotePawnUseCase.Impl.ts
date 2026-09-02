import { ChessPiece } from "../entities/ChessPiece";
import { PromotePawnInput, PromotePawnUseCase } from "./PromotePawnUseCase";

export class PromotePawnUseCaseImpl implements PromotePawnUseCase {
    execute({ pieces, pieceId, promoteTo }: PromotePawnInput): ChessPiece[] {
        return pieces.map((piece) =>
            piece.id === pieceId && piece.type === "pawn"
                ? {
                      ...piece,
                      type: promoteTo,
                  }
                : piece,
        );
    }
}
