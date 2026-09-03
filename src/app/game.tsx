import { ChessGameMode } from "@/features/chess/domain/entities/ChessPiece";
import { ComputerChessGame } from "@/features/chess/presentation/screens/ComputerChessGame";
import { LocalChessGame } from "@/features/chess/presentation/screens/LocalChessGame";
import { useLocalSearchParams } from "expo-router";

export default function GameScreen() {
    const params = useLocalSearchParams<{
        mode?: string;
    }>();

    const gameMode: ChessGameMode =
        params.mode === "computer"
            ? "computer"
            : "local";

    if (gameMode === "computer") {
        return <ComputerChessGame />;
    }

    return <LocalChessGame />;
}