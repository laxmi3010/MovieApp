
import { io } from "socket.io-client";
import API_URL from "./config/api";


let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(`${API_URL}`, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socketInstance;
};