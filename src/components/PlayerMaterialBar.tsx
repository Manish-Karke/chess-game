
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ChessPiece } from "@/features/chess/domain/entities/ChessPiece";
import ChessPieceIcon from "@/features/chess/presentation/components/ChessPieceIcon";

type PlayerMaterialBarProps = {
  color: ChessPiece["color"];
  score: number;
  capturedPieces: ChessPiece[];
  isCurrentTurn?: boolean;
};

const CAPTURED_AREA_HEIGHT = 38;

export function PlayerMaterialBar({
  color,
  score,
  capturedPieces,
  isCurrentTurn = false,
}: PlayerMaterialBarProps) {
  const playerName = color === "white" ? "White" : "Black";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <View
            style={[
              styles.colorIndicator,
              color === "white"
                ? styles.whiteIndicator
                : styles.blackIndicator,
            ]}
          />

          <Text style={styles.playerName}>{playerName}</Text>

          {isCurrentTurn && (
            <Text style={styles.turnLabel}>TURN</Text>
          )}
        </View>

        <Text style={styles.score}>+{score}</Text>
      </View>

      <View style={styles.capturedContainer}>
        {capturedPieces.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.capturedContent}
          >
            {capturedPieces.map((piece) => (
              <View key={piece.id} style={styles.piece}>
                <ChessPieceIcon
                  type={piece.type}
                  color={piece.color}
                  size={24}
                />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyContent} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  header: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  whiteIndicator: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#111827",
  },
  blackIndicator: {
    backgroundColor: "#111827",
  },
  playerName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  turnLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#16A34A",
  },
  score: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  capturedContainer: {
    height: CAPTURED_AREA_HEIGHT,
    marginTop: 4,
    borderRadius: 8,
    backgroundColor: "#D1D5DB",
    overflow: "hidden",
    justifyContent: "center",
  },
  capturedContent: {
    alignItems: "center",
    paddingHorizontal: 6,
    gap: 2,
  },
  emptyContent: {
    flex: 1,
  },
  piece: {
    width: 26,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
