// import {
//     BoardPosition,
//     ChessPiece,
// } from "@/features/chess/domain/entities/ChessPiece";
// import ChessPieceIcon from "@/features/chess/presentation/components/ChessPieceIcon";
// import React from "react";
// import { Pressable, View, useWindowDimensions } from "react-native";

// const BOARD_DIMENSION = 8;
// const HORIZONTAL_PADDING = 16;
// const MAX_BOARD_SIZE = 520;

// type ChessBoardProps = {
//     pieces: ChessPiece[];
//     selectedSquare: BoardPosition | null;
//     validMoves: BoardPosition[];
//     onSquarePress: (row: number, column: number) => void;
//     checkedKingPosition: BoardPosition | null;
// };

// export function ChessBoard({
//     pieces,
//     selectedSquare,
//     onSquarePress,
//     validMoves,
//     checkedKingPosition,
// }: ChessBoardProps) {
//     const { width } = useWindowDimensions();

//     const availableWidth = width - HORIZONTAL_PADDING * 2;
//     const boardSize = Math.min(availableWidth, MAX_BOARD_SIZE);
//     const squareSize = boardSize / BOARD_DIMENSION;

//     const squares = Array.from({
//         length: BOARD_DIMENSION * BOARD_DIMENSION,
//     });

//     return (
//         <View
//             style={{
//                 width: boardSize,
//                 height: boardSize,
//                 flexDirection: "row",
//                 flexWrap: "wrap",
//             }}
//         >
//             {squares.map((_, index) => {
//                 const row = Math.floor(index / BOARD_DIMENSION);
//                 const column = index % BOARD_DIMENSION;

//                 const isLightSquare = (row + column) % 2 === 0;

//                 const isSelected =
//                     selectedSquare?.row === row &&
//                     selectedSquare?.column === column;

//                 const isValidMove = validMoves.some(
//                     (move) => move.row === row && move.column === column,
//                 );
//                 const piece = pieces.find(
//                     (item) => item.row === row && item.column === column,
//                 );
//                 const isKingInCheck =
//                     checkedKingPosition?.row === row &&
//                     checkedKingPosition?.column === column;
//                 return (
//                     <Pressable
//                         key={`${row}-${column}`}
//                         onPress={() => onSquarePress(row, column)}
//                         style={{
//                             width: squareSize,
//                             height: squareSize,
//                             alignItems: "center",
//                             justifyContent: "center",
//                             backgroundColor: isSelected
//                                 ? "#FACC15"
//                                 : isLightSquare
//                                   ? "#F0D9B5"
//                                   : "#B58863",
//                         }}
//                     >
//                         {isKingInCheck && (
//                             <View
//                                 pointerEvents="none"
//                                 style={{
//                                     position: "absolute",
//                                     width: "100%",
//                                     height: "100%",
//                                     backgroundColor: "rgba(239, 68, 68, 0.55)",
//                                 }}
//                             />
//                         )}
//                         {isValidMove && (
//                             <View
//                                 pointerEvents="none"
//                                 style={{
//                                     position: "absolute",
//                                     width: squareSize * 0.28,
//                                     height: squareSize * 0.28,
//                                     borderRadius: squareSize * 0.14,
//                                     backgroundColor: "rgba(34, 197, 94, 0.45)",
//                                 }}
//                             />
//                         )}

//                         {piece && (
//                             <ChessPieceIcon
//                                 type={piece.type}
//                                 color={piece.color}
//                                 size={squareSize * 0.72}
//                             />
//                         )}
//                     </Pressable>
//                 );
//             })}
//         </View>
//     );
// }
import {
    BoardPosition,
    ChessPiece,
} from "@/features/chess/domain/entities/ChessPiece";

import React, { useMemo } from "react";
import { View, useWindowDimensions } from "react-native";

import { ChessSquare } from "./chessSquare";

const BOARD_DIMENSION = 8;
const HORIZONTAL_PADDING = 16;
const MAX_BOARD_SIZE = 520;

type ChessBoardProps = {
    pieces: ChessPiece[];
    selectedSquare: BoardPosition | null;
    validMoves: BoardPosition[];
    checkedKingPosition: BoardPosition | null;
    lastMove?: {
        from: BoardPosition;
        to: BoardPosition;
    } | null;

    onSquarePress: (row: number, column: number) => void;
};

const getPositionKey = (
    row: number,
    column: number,
): string => `${row}-${column}`;

export function ChessBoard({
    pieces,
    selectedSquare,
    validMoves,
    checkedKingPosition,
    lastMove,
    onSquarePress,
}: ChessBoardProps) {
    const { width } = useWindowDimensions();

    const boardSize = Math.min(
        width - HORIZONTAL_PADDING * 2,
        MAX_BOARD_SIZE,
    );

    const squareSize = boardSize / BOARD_DIMENSION;

    const pieceMap = useMemo(() => {
        const map = new Map<string, ChessPiece>();

        for (const piece of pieces) {
            map.set(
                getPositionKey(piece.row, piece.column),
                piece,
            );
        }

        return map;
    }, [pieces]);

    const validMoveSet = useMemo(() => {
        return new Set(
            validMoves.map((move) =>
                getPositionKey(move.row, move.column),
            ),
        );
    }, [validMoves]);

    return (
        <View
            style={{
                width: boardSize,
                height: boardSize,
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            {Array.from({ length: 64 }).map((_, index) => {
                const row = Math.floor(index / BOARD_DIMENSION);
                const column = index % BOARD_DIMENSION;

                const key = getPositionKey(row, column);

                const piece = pieceMap.get(key);

                const isValidMove = validMoveSet.has(key);

                const isSelected =
                    selectedSquare?.row === row &&
                    selectedSquare?.column === column;

                const isKingInCheck =
                    checkedKingPosition?.row === row &&
                    checkedKingPosition?.column === column;

                const isLastMove =
                    (lastMove?.from.row === row &&
                        lastMove.from.column === column) ||
                    (lastMove?.to.row === row &&
                        lastMove.to.column === column);

                return (
                    <ChessSquare
                        key={key}
                        row={row}
                        column={column}
                        size={squareSize}
                        piece={piece}
                        isLight={(row + column) % 2 === 0}
                        isSelected={isSelected}
                        isValidMove={isValidMove}
                        isCaptureMove={
                            isValidMove && Boolean(piece)
                        }
                        isKingInCheck={isKingInCheck}
                        isLastMove={isLastMove}
                        onPress={onSquarePress}
                    />
                );
            })}
        </View>
    );
}