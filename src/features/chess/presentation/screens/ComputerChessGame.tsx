import { createChessFeature } from "../../di/createChessFeature";

import { useComputerChessGameViewModel } from "../viewModels/useComputerChessGameViewModel";

import { ChessGameContent } from "../components/ChessGameContent";

const chessFeature = createChessFeature();

export function ComputerChessGame() {
    const chessGame =
        useComputerChessGameViewModel({
            getLegalMovesUseCase:
                chessFeature.getLegalMovesUseCase,

            movePieceUseCase:
                chessFeature.movePieceUseCase,

            promotePawnUseCase:
                chessFeature.promotePawnUseCase,

            chooseComputerMoveUseCase:
                chessFeature.chooseComputerMoveUseCase,
        });

    return (
        <ChessGameContent
            chessGame={chessGame}
        />
    );
}