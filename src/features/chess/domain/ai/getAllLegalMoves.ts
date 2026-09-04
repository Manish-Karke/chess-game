import { ChessMove, ChessPiece } from "../entities/ChessPiece";
import { GetLegalMovesUseCase } from "../useCases/GetLegalMovesUseCase";

type Input = {
    pieces: ChessPiece[];
    color: ChessPiece["color"];
    lastMove: ChessMove | null;

    getLegalMovesUseCase: GetLegalMovesUseCase;
};

export function getAllLegalMoves({
    pieces,
    color,
    lastMove,
    getLegalMovesUseCase,
}: Input): ChessMove[] {
    const moves: ChessMove[] = [];

    const playerPieces = pieces.filter((piece) => piece.color === color);

    for (const piece of playerPieces) {
        const legalMoves = getLegalMovesUseCase.execute({
            piece,
            pieces,
            lastMove,
        });

        for (const target of legalMoves) {
            moves.push({
                pieceId: piece.id,
                pieceType: piece.type,
                color: piece.color,

                from: {
                    row: piece.row,
                    column: piece.column,
                },
                to: target,
            });
        }
    }
    return moves;
}
