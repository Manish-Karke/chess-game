import {
    BoardPosition,
    ChessMove,
    ChessPiece,
} from "../entities/ChessPiece";

import { applyMoveToPieces } from "../useCases/applyMoveToPieces";

type SimulateMoveInput = {
    pieces: ChessPiece[];
    pieceId: string;
    target: BoardPosition;
    lastMove: ChessMove | null;
};

export function simulateMove({
    pieces,
    pieceId,
    target,
    lastMove,
}: SimulateMoveInput): ChessPiece[] {
    return applyMoveToPieces({
        pieces,
        pieceId,
        target,
        lastMove,
    });
}