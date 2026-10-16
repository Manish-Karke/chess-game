

import {
    io,
    Socket,
} from "socket.io-client";

const SERVER_URL =
    "https://server-5-5h5o.onrender.com";

export const chessSocket: Socket =
    io(
        SERVER_URL,
        {
            autoConnect: false,
            transports: ["websocket"],
        },
    );
