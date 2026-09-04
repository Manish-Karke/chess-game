import { createChessFeature } from "../../di/createChessFeature";
import { useChessGameViewModel } from "../viewModels/useChessGameViewModel";
import { ChessGameContent } from "../components/ChessGameContent";

const chessFeature = createChessFeature();

export function LocalChessGame() {
    const chessGame =
        useChessGameViewModel({
            getLegalMovesUseCase:
                chessFeature.getLegalMovesUseCase,

            movePieceUseCase:
                chessFeature.movePieceUseCase,

            promotePawnUseCase:
                chessFeature.promotePawnUseCase,
        });

    return (
        <ChessGameContent
            chessGame={chessGame}
        />
    );
}