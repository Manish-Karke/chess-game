import { applyMoveToPieces } from "../rules/applyMoveToPieces";
import { MovePieceInput, MovePieceUseCase } from "./MovePieceUseCase";

export class MovePieceUseCaseImpl implements MovePieceUseCase {
    execute({ pieces, pieceId, target, lastMove }: MovePieceInput) {
        return applyMoveToPieces({
            pieces,
            pieceId,
            target,
            lastMove,
        });
    }
}
