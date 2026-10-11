import { createChessFeature } from "../../di/createChessFeature";
import { useChessGameViewModel } from "../viewModels/useChessGameViewModel";
import { ChessGameContent } from "../components/ChessGameContent";
import { useChessMoveSound } from "@/shared/audio/useChessMoveSound";

const chessFeature = createChessFeature();

export function LocalChessGame() {
    const { playMoveSound } = useChessMoveSound();
    const chessGame = useChessGameViewModel({
        getLegalMovesUseCase: chessFeature.getLegalMovesUseCase,
        movePieceUseCase: chessFeature.movePieceUseCase,
        promotePawnUseCase: chessFeature.promotePawnUseCase,
        playMoveSound,
    });

    return <ChessGameContent chessGame={chessGame} />;
}
