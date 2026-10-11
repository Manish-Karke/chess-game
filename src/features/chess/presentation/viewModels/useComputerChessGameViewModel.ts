import { useEffect } from "react";

import { useChessGameViewModel } from "./useChessGameViewModel";
import { GetLegalMovesUseCase } from "../../domain/useCases/GetLegalMovesUseCase";
import { MovePieceUseCase } from "../../domain/useCases/MovePieceUseCase";
import { PromotePawnUseCase } from "../../domain/useCases/PromotePawnUseCase";
import { ChooseComputerMoveUseCase } from "../../domain/useCases/ChooseComputerMoveUseCase";
import { ComputerDifficulty } from "../../domain/entities/ChessPiece";
import { useChessMoveSound } from "@/shared/audio/useChessMoveSound";

type Params = {
    difficulty: ComputerDifficulty;
    getLegalMovesUseCase: GetLegalMovesUseCase;
    movePieceUseCase: MovePieceUseCase;
    promotePawnUseCase: PromotePawnUseCase;

    chooseComputerMoveUseCase: ChooseComputerMoveUseCase;
};
export function useComputerChessGameViewModel({
    getLegalMovesUseCase,
    movePieceUseCase,
    promotePawnUseCase,
    chooseComputerMoveUseCase,
    difficulty,
}: Params) {
    const { playMoveSound } = useChessMoveSound();

    const game = useChessGameViewModel({
        getLegalMovesUseCase,
        movePieceUseCase,
        promotePawnUseCase,
        playMoveSound,
    });

    const isComputerTurn = game.currentTurn === "black";

    useEffect(() => {
        if (!isComputerTurn) {
            return;
        }

        if (
            game.gameStatus === "checkmate" ||
            game.gameStatus === "stalemate"
        ) {
            return;
        }

        const timer = setTimeout(() => {
            const move = chooseComputerMoveUseCase.execute({
                pieces: game.pieces,
                color: "black",
                lastMove: game.lastMove,
                difficulty,
            });

            if (!move) {
                return;
            }

            game.makeMove(move.pieceId, move.to);
        }, 500);

        return () => clearTimeout(timer);
    }, [isComputerTurn, game.pieces, game.lastMove, game.gameStatus]);

    return {
        ...game,

        isComputerTurn,
    };
}
