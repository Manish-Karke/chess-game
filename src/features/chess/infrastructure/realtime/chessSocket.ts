 import {
    io,
    Socket,
} from "socket.io-client";
 const SERVER_URL = "http://192.168.1.71:3000";

 export const chessSocket:Socket =
 io(
    SERVER_URL,{
        autoConnect: false,
        transports :[
            "websocket"
        ]
    }
 )