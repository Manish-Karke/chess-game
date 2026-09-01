import { ChessBoard } from '@/components/chessBoard';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <ChessBoard />
    </SafeAreaView>
  );
}