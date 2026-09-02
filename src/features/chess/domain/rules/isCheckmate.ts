import { ChessPiece } from "../entities/ChessPiece";
import { GetLegalMovesUseCase } from "../useCases/GetLegalMovesUseCase";
import { IsKingInCheck } from "./iskingInCheck";

type IsCheckmateInput = {
    color: ChessPiece["color"];
    pieces: ChessPiece[];
    getLegalMovesUseCase: GetLegalMovesUseCase;

};

export function isCheckmate({
    color,
    pieces,
    getLegalMovesUseCase,
}: IsCheckmateInput): boolean {
     const inCheck = IsKingInCheck({
        color,
        pieces,
    });
     if (!inCheck) {
        return false;
    }
    const playerPieces = pieces.filter(
        (piece) => piece.color === color,
    );

    const hasLegalMove = playerPieces.some(
        (piece) => {
            const legalMoves =
                getLegalMovesUseCase.execute({
                    piece,
                    pieces,
                });

            return legalMoves.length > 0;
        },
    );

    return !hasLegalMove;
}