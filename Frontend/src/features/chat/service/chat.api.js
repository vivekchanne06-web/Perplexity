import axios from "axios";

const api = axios.create({  
    baseURL: import.meta.env.VITE_API_URL || "",
    withCredentials: true, 
});

export async function sendMessage({message,chatId}) {

   try {
    const response = await api.post("/api/chats/messages", { message, chatId });
    return response.data;
    }
    catch (error) {
        console.error("Failed to send message:", error);
        throw error;
    }

}

export async function getChats() {

    try{
        const response = await api.get("/api/chats");
    return response.data;
    }
        catch (error) {
        console.error("Failed to fetch chats:", error);
        throw error;
    }
}
export async function getMessages(chatId) {

    try{
        const response = await api.get(`/api/chats/${chatId}/messages`);
    return response.data;
}
    catch (error) {
        console.error("Failed to fetch messages:", error);
        throw error;
    }
}

export async function deleteChat(chatId) {
    try {
        const response = await api.delete(`/api/chats/delete/${chatId}`);
        return response.data;
    } catch (error) {
        console.error("Failed to delete chat:", error);
        throw error;
    }
}