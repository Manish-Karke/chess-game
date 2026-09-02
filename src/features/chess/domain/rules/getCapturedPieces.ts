import { ChessPiece } from "../entities/ChessPiece";

type GetCapturedPiecesInput = {
    initialPieces: ChessPiece[];
    currentPieces: ChessPiece[];
    capturedColor: ChessPiece["color"];
};

export function getCapturedPieces({
    initialPieces,
    currentPieces,
    capturedColor,
}: GetCapturedPiecesInput): ChessPiece[] {
    const currentPieceIds = new Set(
        currentPieces.map((piece) => piece.id),
    );

    return initialPieces.filter(
        (piece) =>
            piece.color === capturedColor &&
            !currentPieceIds.has(piece.id),
    );
}