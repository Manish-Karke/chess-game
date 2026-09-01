import { ChessBoard } from '@/components/chessBoard';
import { useChessGameViewModel } from '@/features/chess/presentation/viewModels/useChessGameViewModel';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const chessGame = useChessGameViewModel();
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
    // i think this should be pass from the hook
      <ChessBoard 
      pieces ={chessGame.pieces}
      selectedSquare = {chessGame.selectedSquare}
      onSquarePress= {chessGame.handleSquarePress}/>
    </SafeAreaView>
  );
}