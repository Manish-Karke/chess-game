import { ChooseComputerMoveUseCaseImpl } from "../domain/useCases/ChooseComputerMoveUseCase.impl";
import { GetLegalMovesUseCaseImpl } from "../domain/useCases/GetLegalMovesUseCase.Impl";
import { GetValidMovesUseCaseImpl } from "../domain/useCases/GetValidMovesUseCase.Impl";
import { MovePieceUseCaseImpl } from "../domain/useCases/MovePieceUseCase.Impl";
import { PromotePawnUseCaseImpl } from "../domain/useCases/PromotePawnUseCase.Impl";

export function createChessFeature() {
    const getValidMovesUseCase =
        new GetValidMovesUseCaseImpl();

    const getLegalMovesUseCase =
        new GetLegalMovesUseCaseImpl(
            getValidMovesUseCase,
        );

    const movePieceUseCase =
        new MovePieceUseCaseImpl();

    const promotePawnUseCase =
        new PromotePawnUseCaseImpl();

    const chooseComputerMoveUseCase =
        new ChooseComputerMoveUseCaseImpl(
            getLegalMovesUseCase,
        );

    return {
        getLegalMovesUseCase,
        movePieceUseCase,
        promotePawnUseCase,
        chooseComputerMoveUseCase,
    };
}