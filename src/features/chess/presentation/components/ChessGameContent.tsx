
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChessBoard } from "../../../../components/chessBoard";
import { PlayerMaterialBar } from "../../../../components/PlayerMaterialBar";
import { GameControls } from "@/features/chess/presentation/components/GameControl";
import { PromotionOverlay } from "@/features/chess/presentation/components/PromotionOverlay";
import { GameOverOverlay } from "@/features/chess/presentation/components/GameOverOverlay";
import { ChessGameViewModel } from "../types/ChessGameViewModel";

type ChessGameContentProps = {
  chessGame: ChessGameViewModel;
};

const PLAYER_SECTION_HEIGHT = 96;
const BOARD_OFFSET_Y = 16;

export function ChessGameContent({
  chessGame,
}: ChessGameContentProps) {
  const isGameOver =
    chessGame.gameStatus === "checkmate" ||
    chessGame.gameStatus === "stalemate";

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Fixed top section */}
        <View style={styles.playerSection}>
          <GameControls
            currentTurn={chessGame.currentTurn}
            onRestart={chessGame.resetGame}
          />

          <PlayerMaterialBar
            color="black"
            score={chessGame.blackScore}
            capturedPieces={chessGame.piecesCapturedByBlack}
            isCurrentTurn={chessGame.currentTurn === "black"}
          />
        </View>

        {/* Stable board position */}
        <View style={styles.boardArea}>
          <View style={styles.boardShadow}>
            <View style={{ transform: [{ translateY: BOARD_OFFSET_Y }] }}>
              <ChessBoard
                pieces={chessGame.pieces}
                selectedSquare={chessGame.selectedSquare}
                validMoves={chessGame.validMoves}
                checkedKingPosition={chessGame.checkedKingPosition}
                lastMove={chessGame.lastMove}
                onSquarePress={chessGame.handleSquarePress}
              />
            </View>
          </View>
        </View>

        {/* Fixed bottom section */}
        <View style={styles.playerSection}>
          <PlayerMaterialBar
            color="white"
            score={chessGame.whiteScore}
            capturedPieces={chessGame.piecesCapturedByWhite}
            isCurrentTurn={chessGame.currentTurn === "white"}
          />
        </View>

        {/* Overlays do not participate in layout */}
        {chessGame.pendingPromotion && (
          <View style={styles.overlay}>
            <PromotionOverlay
              color={chessGame.pendingPromotion.color}
              onSelect={chessGame.handlePromotion}
            />
          </View>
        )}

        {isGameOver && (
          <View style={styles.overlay}>
            <GameOverOverlay
              result={chessGame.gameStatus as "checkmate" | "stalemate"}
              winner={chessGame.winner}
              onNewGame={chessGame.resetGame}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E5E7EB",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  playerSection: {
    height: PLAYER_SECTION_HEIGHT,
    justifyContent: "center",
  },
  boardArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  boardShadow: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
