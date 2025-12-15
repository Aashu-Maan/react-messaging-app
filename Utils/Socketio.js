/*import {io} from "socket.io-client";

export const createSocketConnection = () => {
  return io("http://localhost:9000");
}
*/
/*
import { io } from "socket.io-client";

export const createSocketConnection = () => {
  return io("https://chat-app-backend-2-ab1j.onrender.com", {
    transports: ["websocket"], // force websocket (avoid long polling spam)
  });
};
*/

import { io } from "socket.io-client";
const SERVER_URL = "https://chat-app-backend-2-ab1j.onrender.com" || "http://localhost:5491";
export const createSocketConnection = () => {
  return io("https://react-messaging-app-backend.onrender.com", {
    transports: ["websocket"],
    withCredentials: true, // ✅ optional but recommended
  });
};