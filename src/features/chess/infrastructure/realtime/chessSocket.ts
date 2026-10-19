import { tokenRefreshService } from "@/features/auth/infrastructure/api/TokenRefreshService";
import { SessionExpiredError } from "@/features/auth/infrastructure/api/TokenRefreshService";
import { io, Socket } from "socket.io-client";

const SERVER_URL = "https://server-5-5h5o.onrender.com";

export const chessSocket: Socket = io(SERVER_URL, {
    autoConnect: false,
    transports: ["websocket"],
});

let isConnecting = false;
let connectionPromise: Promise<Socket> | null = null;

export async function connectChessSocket(): Promise<Socket> {
    if (chessSocket.connected) {
        return chessSocket;
    }

    // Share an in-progress connection attempt instead of starting
    // duplicate connection attempts from multiple screens.
    if (connectionPromise) {
        return connectionPromise;
    }

    isConnecting = true;

    connectionPromise = (async () => {
        try {
            const token = await tokenRefreshService.getValidAccessToken();

            chessSocket.auth = { token };

            await new Promise<void>((resolve, reject) => {
                const onConnect = () => {
                    cleanup();
                    resolve();
                };

                const onConnectError = (error: Error) => {
                    cleanup();
                    reject(error);
                };

                const cleanup = () => {
                    chessSocket.off("connect", onConnect);
                    chessSocket.off("connect_error", onConnectError);
                };

                chessSocket.once("connect", onConnect);
                chessSocket.once("connect_error", onConnectError);
                chessSocket.connect();
            });

            return chessSocket;
        } catch (error) {
            if (error instanceof SessionExpiredError) {
                throw new Error("Your session expired. Please log in again.");
            }

            throw error;
        } finally {
            isConnecting = false;
            connectionPromise = null;
        }
    })();

    return connectionPromise;
}

export function disconnectChessSocket(): void {
    chessSocket.disconnect();
    connectionPromise = null;
    isConnecting = false;
}
