
import { ChessPiece } from "@/features/chess/domain/entities/ChessPiece";
import ChessPieceIcon from "@/features/chess/presentation/components/ChessPieceIcon";
import React from "react";
import {
    Text,
    View,
} from "react-native";

type PlayerMaterialBarProps = {
    color: ChessPiece["color"];
    score: number;

    capturedPieces: ChessPiece[];

    isCurrentTurn?: boolean;
};

export function PlayerMaterialBar({
    color,
    score,
    capturedPieces,
    isCurrentTurn = false,
}: PlayerMaterialBarProps) {
    const playerName =
        color === "white"
            ? "White"
            : "Black";

    return (
        <View
            style={{
                width: "100%",
                paddingHorizontal: 4,
                paddingVertical: 10,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                    }}
                >
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,

                            backgroundColor:
                                color === "white"
                                    ? "#F8FAFC"
                                    : "#111827",

                            borderWidth:
                                color === "white"
                                    ? 1
                                    : 0,

                            borderColor: "#111827",
                        }}
                    />

                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "800",
                            color: "#111827",
                        }}
                    >
                        {playerName}
                    </Text>

                    {isCurrentTurn && (
                        <Text
                            style={{
                                fontSize: 11,
                                fontWeight: "700",
                                color: "#16A34A",
                            }}
                        >
                            TURN
                        </Text>
                    )}
                </View>

                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "900",
                        color: "#111827",
                    }}
                >
                    +{score}
                </Text>
            </View>

            {capturedPieces.length > 0 && (
                <View
                    style={{
                        marginTop: 6,
                        flexDirection: "row",
                        flexWrap: "wrap",
                        alignItems: "center",
                    }}
                >
                    {capturedPieces.map(
                        (piece) => (
                            <View
                                key={piece.id}
                                style={{
                                    marginRight: -4,
                                }}
                            >
                                <ChessPieceIcon
                                    type={piece.type}
                                    color={piece.color}
                                    size={24}
                                />
                            </View>
                        ),
                    )}
                </View>
            )}
        </View>
    );
}