import {
    ChessGameMode,
    ComputerDifficulty,
} from "@/features/chess/domain/entities/ChessPiece";
import { ComputerChessGame } from "@/features/chess/presentation/screens/ComputerChessGame";
import { LocalChessGame } from "@/features/chess/presentation/screens/LocalChessGame";
import { useLocalSearchParams } from "expo-router";

export default function GameScreen() {
    const params = useLocalSearchParams<{
        mode?: string;
        difficulty?: string;
    }>();

    const gameMode: ChessGameMode =
        params.mode === "computer" ? "computer" : "local";

    const difficulty: ComputerDifficulty =
        params.difficulty === "hard"
            ? "hard"
            : params.difficulty === "medium"
              ? "medium"
              : "easy";
    if (gameMode === "computer") {
        return <ComputerChessGame
                difficulty={difficulty}
            />;
    }

    return <LocalChessGame />;
}
