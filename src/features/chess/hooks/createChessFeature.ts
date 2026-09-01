import { GetValidMovesUseCaseImpl } from "../domain/useCases/GetValidMovesUseCase.Impl";
import { MovePieceUseCaseImpl } from "../domain/useCases/MovePieceUseCase.Impl";


export function createChessFeature() {
    const getValidMovesUseCase =
        new GetValidMovesUseCaseImpl();

    const movePieceUseCase =
        new MovePieceUseCaseImpl();

    return {
        getValidMovesUseCase,
        movePieceUseCase,
    };
}