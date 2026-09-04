import ChessPieceIcon from "./ChessPieceIcon";
import React from "react";
import { Pressable, Text, View } from "react-native";

export type PromotionPieceType = "queen" | "rook" | "bishop" | "knight";

type PromotionOverlayProps = {
    color: "white" | "black";
    onSelect: (piece: PromotionPieceType) => void;
};

const PROMOTION_OPTIONS: PromotionPieceType[] = [
    "queen",
    "rook",
    "bishop",
    "knight",
];

export function PromotionOverlay({ color, onSelect }: PromotionOverlayProps) {
    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,

                alignItems: "center",
                justifyContent: "center",

                backgroundColor: "rgba(0,0,0,0.72)",

                zIndex: 200,
            }}
        >
            <View
                style={{
                    backgroundColor: "#FFFFFF",
                    padding: 24,
                    borderRadius: 16,
                    alignItems: "center",
                }}
            >
                <Text
                    style={{
                        fontSize: 22,
                        fontWeight: "800",
                        marginBottom: 20,
                    }}
                >
                    Promote Pawn
                </Text>

                <View
                    style={{
                        flexDirection: "row",
                        gap: 12,
                    }}
                >
                    {PROMOTION_OPTIONS.map((piece) => (
                        <Pressable
                            key={piece}
                            onPress={() => onSelect(piece)}
                            style={{
                                width: 64,
                                height: 64,

                                alignItems: "center",
                                justifyContent: "center",

                                borderRadius: 10,
                                backgroundColor: "#E5E7EB",
                            }}
                        >
                            <ChessPieceIcon
                                type={piece}
                                color={color}
                                size={46}
                            />
                        </Pressable>
                    ))}
                </View>
            </View>
        </View>
    );
}
