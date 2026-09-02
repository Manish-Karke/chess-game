import { ChessBoard } from "@/components/chessBoard";
import { createChessFeature } from "@/features/chess/hooks/createChessFeature";

import { GameControls } from "@/features/chess/presentation/components/GameControl";
import { GameOverOverlay } from "@/features/chess/presentation/components/GameOverOverlay";
import { PromotionOverlay } from "@/features/chess/presentation/components/PromotionOverlay";

import { useChessGameViewModel } from "@/features/chess/presentation/viewModels/useChessGameViewModel";

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const chessFeature = createChessFeature();

export default function HomeScreen() {
    const chessGame = useChessGameViewModel({
        getLegalMovesUseCase: chessFeature.getLegalMovesUseCase,

        movePieceUseCase: chessFeature.movePieceUseCase,

        promotePawnUseCase: chessFeature.promotePawnUseCase,
    });

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center">
                <GameControls
                    currentTurn={chessGame.currentTurn}
                    onRestart={chessGame.resetGame}
                />
                <View
                    style={{
                        borderRadius: 12,

                        shadowColor: "#00000",
                        shadowOffset: {
                            width: 0,
                            height: 12,
                        },
                        shadowOpacity: 1,
                        shadowRadius: 10,

                        elevation: 10,
                    }}
                >
                    <ChessBoard
                        pieces={chessGame.pieces}
                        selectedSquare={chessGame.selectedSquare}
                        validMoves={chessGame.validMoves}
                        checkedKingPosition={chessGame.checkedKingPosition}
                        onSquarePress={chessGame.handleSquarePress}
                    />
                </View>
                {/* Pawn promotion */}
                {chessGame.pendingPromotion && (
                    <PromotionOverlay
                        color={chessGame.pendingPromotion.color}
                        onSelect={chessGame.handlePromotion}
                    />
                )}

                {/* Checkmate / stalemate */}
                {(chessGame.gameStatus === "checkmate" ||
                    chessGame.gameStatus === "stalemate") && (
                    <GameOverOverlay
                        result={chessGame.gameStatus}
                        winner={chessGame.winner}
                        onNewGame={chessGame.resetGame}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
