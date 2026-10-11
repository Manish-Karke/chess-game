
import { useEffect } from "react";
import { createChessFeature } from "../../di/createChessFeature";
import { ChessGameContent } from "../components/ChessGameContent";
import { useOnlineChessGameViewModel } from "../viewModels/useOnlineChessGameViewModel";
import { chessSocket } from "../../infrastructure/realtime/chessSocket";
import { useChessMoveSound } from "@/shared/audio/useChessMoveSound";

const chessFeature = createChessFeature();

type OnlineChessGameProps = {
    gameId: string;
    color: "white" | "black";
};

export function OnlineChessGame({
    gameId,
    color,
}: OnlineChessGameProps) {
    const { playMoveSound } = useChessMoveSound();

    const chessGame = useOnlineChessGameViewModel({
        gameId,
        color,
        getLegalMovesUseCase: chessFeature.getLegalMovesUseCase,
        movePieceUseCase: chessFeature.movePieceUseCase,
        promotePawnUseCase: chessFeature.promotePawnUseCase,
        playMoveSound,
    });

    useEffect(() => {
        chessSocket.emit("debug:test", {
            message: "hello from online game",
        });
    }, []);

    return <ChessGameContent chessGame={chessGame} />;
}
