import { ChessPiece } from "../entities/ChessPiece";
import { GetLegalMovesUseCase } from "../useCases/GetLegalMovesUseCase";
import { IsKingInCheck } from "./iskingInCheck";

type IsStalemateInput = {
    color: ChessPiece["color"];
    pieces: ChessPiece[];
    getLegalMovesUseCase: GetLegalMovesUseCase;
};

export function IsStalemate({
    color,
    pieces,
    getLegalMovesUseCase,
}: IsStalemateInput): boolean {
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

    const hasAnyLegalMove = playerPieces.some(
        (piece) => {
            const legalMoves =
                getLegalMovesUseCase.execute({
                    piece,
                    pieces,
                });

            return legalMoves.length > 0;
        },
    );

    return !hasAnyLegalMove;
}
