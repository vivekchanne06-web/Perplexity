import { io } from "socket.io-client";


export const initializeSocketConnection = () => {

    const socket = io('https://perplexity-rf72.onrender.com', {
        withCredentials: true,
    });
    
    
    
}