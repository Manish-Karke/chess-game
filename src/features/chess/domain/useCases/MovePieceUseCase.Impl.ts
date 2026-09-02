// import { MovePieceInput, MovePieceUseCase } from "./MovePieceUseCase";

// import { ChessPiece } from "../entities/ChessPiece";

// export class MovePieceUseCaseImpl implements MovePieceUseCase {
//     execute({ pieces, pieceId, target }: MovePieceInput): ChessPiece[] {
//         const movingPiece = pieces.find((piece) => piece.id === pieceId);

//         if (!movingPiece) {
//             return pieces;
//         }

//         const targetPiece = pieces.find(
//             (piece) =>
//                 piece.row === target.row && piece.column === target.column,
//         );

//         // Never capture a king.
//         if (targetPiece?.type === "king") {
//             return pieces;
//         }

//         // Never capture your own piece.
//         if (targetPiece && targetPiece.color === movingPiece.color) {
//             return pieces;
//         }

//         const remainingPieces = targetPiece
//             ? pieces.filter((piece) => piece.id !== targetPiece.id)
//             : pieces;

//         return remainingPieces.map((piece) =>
//             piece.id === pieceId
//                 ? {
//                       ...piece,
//                       row: target.row,
//                       column: target.column,
//                   }
//                 : piece,
//         );
//     }
// }

import { applyMoveToPieces } from "./applyMoveToPieces";
import {
    MovePieceInput,
    MovePieceUseCase,
} from "./MovePieceUseCase";

export class MovePieceUseCaseImpl
    implements MovePieceUseCase
{
    execute({
        pieces,
        pieceId,
        target,
    }: MovePieceInput) {
        return applyMoveToPieces({
            pieces,
            pieceId,
            target,
        });
    }
}