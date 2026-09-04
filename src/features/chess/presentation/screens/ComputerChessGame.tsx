import { createChessFeature } from "../../di/createChessFeature";

import { useComputerChessGameViewModel } from "../viewModels/useComputerChessGameViewModel";

import { ChessGameContent } from "../components/ChessGameContent";
import { ComputerDifficulty } from "../../domain/entities/ChessPiece";

const chessFeature = createChessFeature();
type ComputerChessGameProps = {
    difficulty: ComputerDifficulty;
};
export function ComputerChessGame({
    difficulty
}:ComputerChessGameProps) {
    const chessGame =
        useComputerChessGameViewModel({
            difficulty,
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