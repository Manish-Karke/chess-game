import { ChessBoard } from "@/components/chessBoard";
import { createChessFeature } from "@/features/chess/hooks/createChessFeature";
import { useChessGameViewModel } from "@/features/chess/presentation/viewModels/useChessGameViewModel";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const chessFeature = createChessFeature();
export default function HomeScreen() {
    const chessGame = useChessGameViewModel({
        getValidMovesUseCase: chessFeature.getValidMovesUseCase,
    });
    return (
        <SafeAreaView className="flex-1 items-center justify-center bg-white">
            {/* i think this should be passed from the hook */}

            <ChessBoard
                pieces={chessGame.pieces}
                selectedSquare={chessGame.selectedSquare}
                validMoves={chessGame.validMoves}
                onSquarePress={chessGame.handleSquarePress}
            />
        </SafeAreaView>
    );
}
