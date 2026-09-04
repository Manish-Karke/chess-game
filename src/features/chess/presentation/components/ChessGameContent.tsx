import { View } from "react-native";
import { ChessBoard } from "../../../../components/chessBoard";
import { PlayerMaterialBar } from "../../../../components/PlayerMaterialBar";
import { GameControls } from "@/features/chess/presentation/components/GameControl";
import { SafeAreaView } from "react-native-safe-area-context";
import { PromotionOverlay } from "@/features/chess/presentation/components/PromotionOverlay";
import { GameOverOverlay } from "@/features/chess/presentation/components/GameOverOverlay";
import { useChessGameViewModel } from "@/features/chess/presentation/viewModels/useChessGameViewModel";

type ChessGameContentProps = {
    chessGame: ReturnType<
        typeof useChessGameViewModel
    >;
};

export function ChessGameContent({
    chessGame,
}: ChessGameContentProps) {
    return (
        <SafeAreaView className="flex-1 bg-slate-300">
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingHorizontal: 16,
                }}
            >
                <GameControls
                    currentTurn={
                        chessGame.currentTurn
                    }
                    onRestart={
                        chessGame.resetGame
                    }
                />

                <PlayerMaterialBar
                    color="black"
                    score={
                        chessGame.blackScore
                    }
                    capturedPieces={
                        chessGame.piecesCapturedByBlack
                    }
                    isCurrentTurn={
                        chessGame.currentTurn ===
                        "black"
                    }
                />

                <View
                    style={{
                        borderRadius: 12,

                        shadowColor: "#000",

                        shadowOffset: {
                            width: 0,
                            height: 8,
                        },

                        shadowOpacity: 0.25,

                        shadowRadius: 10,

                        elevation: 10,
                    }}
                >
                    <ChessBoard
                        pieces={
                            chessGame.pieces
                        }
                        selectedSquare={
                            chessGame.selectedSquare
                        }
                        validMoves={
                            chessGame.validMoves
                        }
                        checkedKingPosition={
                            chessGame.checkedKingPosition
                        }
                        lastMove={
                            chessGame.lastMove
                        }
                        onSquarePress={
                            chessGame.handleSquarePress
                        }
                    />
                </View>

                <PlayerMaterialBar
                    color="white"
                    score={
                        chessGame.whiteScore
                    }
                    capturedPieces={
                        chessGame.piecesCapturedByWhite
                    }
                    isCurrentTurn={
                        chessGame.currentTurn ===
                        "white"
                    }
                />

                {chessGame.pendingPromotion && (
                    <PromotionOverlay
                        color={
                            chessGame
                                .pendingPromotion
                                .color
                        }
                        onSelect={
                            chessGame.handlePromotion
                        }
                    />
                )}

                {(
                    chessGame.gameStatus ===
                        "checkmate" ||
                    chessGame.gameStatus ===
                        "stalemate"
                ) && (
                    <GameOverOverlay
                        result={
                            chessGame.gameStatus
                        }
                        winner={
                            chessGame.winner
                        }
                        onNewGame={
                            chessGame.resetGame
                        }
                    />
                )}
            </View>
        </SafeAreaView>
    );
}