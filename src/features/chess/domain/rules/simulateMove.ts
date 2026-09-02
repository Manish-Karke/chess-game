import { BoardPosition, ChessPiece } from "../entities/ChessPiece";

type SimulateMoveInput = {
    pieces: ChessPiece[];
    pieceId: string;
    target: BoardPosition;
};

export function simulateMove({
    pieces,
    pieceId,
    target,
}: SimulateMoveInput): ChessPiece[] {
    return pieces
        .filter((piece) => {
            const isTargetPiece =
                piece.row === target.row && piece.column === target.column;

            if (!isTargetPiece) {
                return true;
            }
            // Keep the moving piece if for some reason it is target
            return piece.id === pieceId;
        })
        .map((piece) =>
            piece.id === pieceId
                ? {
                      ...piece,
                      row: target.row,
                      column: target.column,
                  }
                : piece,
        );
}
