import React from 'react';
import { View, useWindowDimensions } from 'react-native';

const BOARD_SIZE = 8;

export function ChessBoard() {
  const { width } = useWindowDimensions();

  const horizontalPadding = 16;
  const boardSize = width - horizontalPadding * 2;
  const squareSize = boardSize / BOARD_SIZE;

  const squares = Array.from({ length: BOARD_SIZE * BOARD_SIZE });

  return (
    <View
      style={{
        width: boardSize,
        height: boardSize,
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}
    >
      {squares.map((_, index) => {
        const row = Math.floor(index / BOARD_SIZE);
        const column = index % BOARD_SIZE;

        const isLight = (row + column) % 2 === 0;

        return (
          <View
            key={index}
            style={{
              width: squareSize,
              height: squareSize,
              backgroundColor: isLight ? '#F0D9B5' : '#B58863',
            }}
          />
        );
      })}
    </View>
  );
}