// import {
//     ChessGameMode,
//     ComputerDifficulty,
// } from "@/features/chess/domain/entities/ChessPiece";
// import { ComputerChessGame } from "@/features/chess/presentation/screens/ComputerChessGame";
// import { LocalChessGame } from "@/features/chess/presentation/screens/LocalChessGame";
// import { useLocalSearchParams } from "expo-router";

// export default function GameScreen() {
//     const params = useLocalSearchParams<{
//         mode?: string;
//         difficulty?: string;
//     }>();

//     const gameMode: ChessGameMode =
//         params.mode === "online"
//             ? "online"
//             : params.mode === "computer"
//               ? "computer"
//               : "local";
              
//     const difficulty: ComputerDifficulty =
//         params.difficulty === "hard"
//             ? "hard"
//             : params.difficulty === "medium"
//               ? "medium"
//               : "easy";
//     if (gameMode === "computer") {
//         return <ComputerChessGame difficulty={difficulty} />;
//     }

//     if (gameMode === "online") {
//         return <ComputerChessGame difficulty={difficulty} />;
//     }

//     return <LocalChessGame />;
// }
import {
    ChessGameMode,
    ComputerDifficulty,
} from "@/features/chess/domain/entities/ChessPiece";

import { ComputerChessGame } from "@/features/chess/presentation/screens/ComputerChessGame";
import { LocalChessGame } from "@/features/chess/presentation/screens/LocalChessGame";
import { OnlineChessGame } from "@/features/chess/presentation/screens/OnlineChessGame";

import { useLocalSearchParams } from "expo-router";

export default function GameScreen() {
    const params = useLocalSearchParams<{
        mode?: string;
        difficulty?: string;
        gameId?: string;
        color?: "white" | "black";
    }>();

    const gameMode: ChessGameMode =
        params.mode === "online"
            ? "online"
            : params.mode === "computer"
              ? "computer"
              : "local";

    const difficulty: ComputerDifficulty =
        params.difficulty === "hard"
            ? "hard"
            : params.difficulty === "medium"
              ? "medium"
              : "easy";

    if (gameMode === "computer") {
        return (
            <ComputerChessGame
                difficulty={difficulty}
            />
        );
    }

    if (gameMode === "online") {
        if (!params.gameId || !params.color) {
            return null;
        }

        return (
            <OnlineChessGame
                gameId={params.gameId}
                color={params.color}
            />
        );
    }

    return <LocalChessGame />;
}