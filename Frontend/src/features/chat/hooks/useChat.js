import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat } from "../service/chat.api";
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, removeChat } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {

    const dispatch = useDispatch();

    async function handleSendMessage({ message, chatId }) {
        try {
            dispatch(setLoading(true));


            const data = await sendMessage({ message, chatId });

            const { chat, aiMessage } = data;
            const effectiveChatId = chat?.id || chat?._id || chatId;

            if (!chatId && effectiveChatId) {
                dispatch(
                    createNewChat({
                        chatId: effectiveChatId,
                        title: chat?.title || "New Chat",
                    })
                );
            }

            dispatch(addNewMessage({
                chatId: effectiveChatId,
                content: message,
                role: "user"
            }));

            dispatch(addNewMessage({
                chatId: effectiveChatId,
                content: aiMessage.content,
                role: aiMessage.role?.toLowerCase() || "ai"
            }));

            dispatch(setCurrentChatId(effectiveChatId));
        }
        catch (error) {
            dispatch(setError(`Failed to send message. Please try again. + ${error.message}`));
        } finally {
            dispatch(setLoading(false));
        }
    }


    async function handleGetChats() {
        try {
            dispatch(setLoading(true));

            const data = await getChats();
            const { chats } = data;

            const formatted = chats.reduce((acc, chat) => {
                const resolvedChatId = chat?._id || chat?.id;

                if (!resolvedChatId) {
                    return acc;
                }

                acc[resolvedChatId] = {
                    id: resolvedChatId,
                    title: chat.title,
                    messages: [], // messages loaded later
                };
                return acc;
            }, {});


            dispatch(setChats(formatted));

        } catch (error) {
            dispatch(setError(`Failed to fetch chats. Please try again. + ${error.message}`));
        } finally {
            dispatch(setLoading(false));
        }

    }


    async function handleOpenChat(chatId) {
        if (!chatId) {
            dispatch(setError("Invalid chat id. Please refresh and try again."));
            return;
        }

        try {
            dispatch(setLoading(true));

            const data = await getMessages(chatId);
            const { messages } = data;

            const formattedMessages = messages.map(msg => ({
                content: msg.content,
                role: msg.role?.toLowerCase() || "ai"
            }));
            dispatch(addMessages({
                chatId,
                messages: formattedMessages
            }));
            dispatch(setCurrentChatId(chatId));
        }
        catch (error) {
            dispatch(setError(`Failed to fetch messages. Please try again. + ${error.message}`));
        } finally {
            dispatch(setLoading(false));
        }
    }


    async function handleDeleteChat(chatId) {
        try {
            dispatch(setLoading(true));
            await deleteChat(chatId);
            dispatch(removeChat(chatId)); 
        } catch (error) {
            dispatch(setError(`Failed to delete chat: ${error.message}`));
        } finally {
            dispatch(setLoading(false));
        }
    }


    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat
    }


}