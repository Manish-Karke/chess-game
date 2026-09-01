// import React from 'react';
// import { View, useWindowDimensions } from 'react-native';

// const BOARD_SIZE = 8;

// export function ChessBoard() {
//   const { width } = useWindowDimensions();

//   const horizontalPadding = 16;
//   const boardSize = width - horizontalPadding * 2;
//   const squareSize = boardSize / BOARD_SIZE;

//   const squares = Array.from({ length: BOARD_SIZE * BOARD_SIZE });

//   return (
//     <View
//       style={{
//         width: boardSize,
//         height: boardSize,
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//       }}
//     >
//       {squares.map((_, index) => {
//         const row = Math.floor(index / BOARD_SIZE);
//         const column = index % BOARD_SIZE;

//         const isLight = (row + column) % 2 === 0;

//         return (
//           <View
//             key={index}
//             style={{
//               width: squareSize,
//               height: squareSize,
//               backgroundColor: isLight ? '#F0D9B5' : '#B58863',
//             }}
//           />
//         );
//       })}
//     </View>
//   );
// }

import { initialChessPieces } from "@/features/chess/domain/constants/initialChessPieces";
import ChessPieceIcon from "@/features/chess/presentation/components/ChessPieceIcon";
import React from "react";
import { View, useWindowDimensions } from "react-native";

const BOARD_DIMENSION = 8;
const HORIZONTAL_PADDING = 16;
const MAX_BOARD_SIZE = 520;

export function ChessBoard() {
    const { width } = useWindowDimensions();

    const availableWidth = width - HORIZONTAL_PADDING * 2;
    const boardSize = Math.min(availableWidth, MAX_BOARD_SIZE);
    const squareSize = boardSize / BOARD_DIMENSION;

    const squares = Array.from({
        length: BOARD_DIMENSION * BOARD_DIMENSION,
    });

    return (
        <View
            style={{
                width: boardSize,
                height: boardSize,
                flexDirection: "row",
                flexWrap: "wrap",
            }}
        >
            {squares.map((_, index) => {
                const row = Math.floor(index / BOARD_DIMENSION);
                const column = index % BOARD_DIMENSION;

                const isLightSquare = (row + column) % 2 === 0;

                const piece = initialChessPieces.find(
                    (item) => item.row === row && item.column === column,
                );

                return (
                    <View
                        key={`${row}-${column}`}
                        style={{
                            width: squareSize,
                            height: squareSize,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: isLightSquare
                                ? "#F0D9B5"
                                : "#B58863",
                        }}
                    >
                        {piece && (
                            <ChessPieceIcon
                                type={piece.type}
                                color={piece.color}
                                size={squareSize * 0.72}
                            />
                        )}
                    </View>
                );
            })}
        </View>
    );
}
