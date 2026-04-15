import { io } from "socket.io-client";


export const initializeSocketConnection = () => {

    const URL = import.meta.env.VITE_API_URL || window.location.origin;

    const socket = io(URL, {
        withCredentials: true,
    });

    return socket;
    
    
    
}