import { useCallback, useEffect } from "react";

import { chessSocket } from "../../infrastructure/realtime/chessSocket";

import { useChessGameViewModel } from "./useChessGameViewModel";

import { GetLegalMovesUseCase } from "../../domain/useCases/GetLegalMovesUseCase";
import { MovePieceUseCase } from "../../domain/useCases/MovePieceUseCase";
import { PromotePawnUseCase } from "../../domain/useCases/PromotePawnUseCase";

import type { ChessMove } from "../../domain/entities/ChessPiece";

type PlayerColor = "white" | "black";

type UseOnlineChessGameViewModelParams = {
    gameId: string;
    color: PlayerColor;

    getLegalMovesUseCase: GetLegalMovesUseCase;
    movePieceUseCase: MovePieceUseCase;
    promotePawnUseCase: PromotePawnUseCase;
};

export function useOnlineChessGameViewModel({
    gameId,
    color,
    getLegalMovesUseCase,
    movePieceUseCase,
    promotePawnUseCase,
}: UseOnlineChessGameViewModelParams) {
    const chessGame = useChessGameViewModel({
        getLegalMovesUseCase,
        movePieceUseCase,
        promotePawnUseCase,

        onMove: (move: ChessMove) => {
            chessSocket.emit(
                "game:move",
                move,
            );
        },
    });

    const {
        makeMove,
        currentTurn,
        handleSquarePress: chessHandleSquarePress,
    } = chessGame;
    useEffect(() => {
        chessSocket.emit("debug:test", {
            message: "hello from online game",
        });
    }, [gameId, color]);
    useEffect(() => {
        const handleOpponentMove = (move: ChessMove) => {
            makeMove(move.pieceId, move.to);
        };

        chessSocket.on("game:move", handleOpponentMove);

        return () => {
            chessSocket.off("game:move", handleOpponentMove);
        };
    }, [makeMove]);

  
    const handleSquarePress = useCallback(
        (row: number, column: number) => {
           

            if (currentTurn !== color) {
                return;
            }
            chessHandleSquarePress(row, column);
        },
        [currentTurn, color, chessHandleSquarePress],
    );
    return {
        ...chessGame,
        handleSquarePress,
    };
}
