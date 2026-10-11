import {
    ChooseComputerMoveInput,
    ChooseComputerMoveUseCase,
} from "./ChooseComputerMoveUseCase";

import { ChessMove } from "../entities/ChessPiece";
import { ComputerMoveStrategy } from "../ai/ComputerMoveStrategy";


export class ChooseComputerMoveUseCaseImpl
    implements ChooseComputerMoveUseCase
{
    constructor(
        private readonly easyStrategy:
            ComputerMoveStrategy,

        private readonly mediumStrategy:
            ComputerMoveStrategy,

        private readonly hardStrategy:
            ComputerMoveStrategy,
    ) {}

    execute(
        input: ChooseComputerMoveInput,
    ): ChessMove | null {
        switch (input.difficulty) {
            case "easy":
                return this.easyStrategy.chooseMove(
                    input,
                );

            case "medium":
                return this.mediumStrategy.chooseMove(
                    input,
                );

            case "hard":
                return this.hardStrategy.chooseMove(
                    input,
                );
        }
    }
}