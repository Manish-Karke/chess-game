import { useAudioPlayer } from "expo-audio";
const MOVE_SOUND = require("../../../assets/sounds/chess-move.mp3");

export function useChessMoveSound() {
    const player = useAudioPlayer(MOVE_SOUND);

    const playMoveSound = () => {
        player.seekTo(0);
        player.play();
    };

    return { playMoveSound };
}
