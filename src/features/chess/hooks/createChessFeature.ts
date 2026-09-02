import { GetLegalMovesUseCaseImpl } from "../domain/useCases/GetLegalMovesUseCase.Impl";
import { GetValidMovesUseCaseImpl } from "../domain/useCases/GetValidMovesUseCase.Impl";
import { MovePieceUseCaseImpl } from "../domain/useCases/MovePieceUseCase.Impl";


export function createChessFeature() {
    const getValidMovesUseCase =
        new GetValidMovesUseCaseImpl();

    const getLegalMovesUseCase =
        new GetLegalMovesUseCaseImpl(
            getValidMovesUseCase,
        );

    const movePieceUseCase =
        new MovePieceUseCaseImpl();

    return {
        getValidMovesUseCase,
        getLegalMovesUseCase,
        movePieceUseCase,
    };
}