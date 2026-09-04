import { EasyComputerStrategy } from "../domain/ai/EasyComputerStrategy";
import { HardComputerStrategy } from "../domain/ai/HardComputerStrategy";
import { MediumComputerStrategy } from "../domain/ai/MediumComputerStrategy";
import { ChooseComputerMoveUseCaseImpl } from "../domain/useCases/ChooseComputerMoveUseCase.impl";
import { GetLegalMovesUseCaseImpl } from "../domain/useCases/GetLegalMovesUseCase.Impl";
import { GetValidMovesUseCaseImpl } from "../domain/useCases/GetValidMovesUseCase.Impl";
import { MovePieceUseCaseImpl } from "../domain/useCases/MovePieceUseCase.Impl";
import { PromotePawnUseCaseImpl } from "../domain/useCases/PromotePawnUseCase.Impl";

export function createChessFeature() {
    const getValidMovesUseCase = new GetValidMovesUseCaseImpl();

    const getLegalMovesUseCase = new GetLegalMovesUseCaseImpl(
        getValidMovesUseCase,
    );

    const easyComputerStrategy = new EasyComputerStrategy(getLegalMovesUseCase);

    const mediumComputerStrategy = new MediumComputerStrategy(
        getLegalMovesUseCase,
    );

    const hardComputerStrategy = new HardComputerStrategy(getLegalMovesUseCase);
    const movePieceUseCase = new MovePieceUseCaseImpl();

    const promotePawnUseCase = new PromotePawnUseCaseImpl();

    const chooseComputerMoveUseCase = new ChooseComputerMoveUseCaseImpl(
        easyComputerStrategy,
        mediumComputerStrategy,
        hardComputerStrategy,
    );

    return {
        getLegalMovesUseCase,
        movePieceUseCase,
        promotePawnUseCase,
        chooseComputerMoveUseCase,
    };
}
