import {
    ChessPieceColor,
    ChessPieceType,
} from "../../domain/entities/ChessPiece";
import BishopIcon from "../icons/BishopIcon";
import KingIcon from "../icons/KingIcon";
import KnightIcon from "../icons/KnightIcon";
import PawnIcon from "../icons/PawnIcon";
import QueenIcon from "../icons/QueenIcon";
import RookIcon from "../icons/RookIcon";

type chessPieceIconProps = {
    type: ChessPieceType;
    color: ChessPieceColor;
    size: number;
};

export default function ChessPieceIcon({
    type,
    color,
    size,
}: chessPieceIconProps) {
    const fill = color === "white" ? "#F8FAFC" : "#111827";
    switch (type) {
        case "king":
            return <KingIcon size={size} color={fill} />;
        case "queen":
            return <QueenIcon size={size} color={fill} />;
        case "rook":
            return <RookIcon size={size} color={fill} />;
        case "bishop":
            return <BishopIcon size={size} color={fill} />;
        case "knight":
            return <KnightIcon size={size} color={fill} />;
        case "pawn":
            return <PawnIcon size={size} color={fill} />;
    }
}
