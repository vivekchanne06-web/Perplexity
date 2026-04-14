import { createSlice } from "@reduxjs/toolkit";



const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        setChats(state, action) {
            state.chats = {
                ...state.chats,
                ...action.payload
            }
        },

        setCurrentChatId(state, action) { state.currentChatId = action.payload },

        setLoading(state, action) { state.isLoading = action.payload },

        setError(state, action) { state.error = action.payload },

        createNewChat(state, action) {
            const { chatId, title } = action.payload

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title,
                    messages: [],
                };
            }
        },

        addNewMessage(state, action) {
            const { chatId, content, role } = action.payload;

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title: "New Chat",
                    messages: []
                }
            }

            state.chats[chatId].messages.push({
                content,
                role
            })
        },

        addMessages(state, action) {
            const { chatId, messages } = action.payload;

            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title: "New Chat",
                    messages: [],
                };
            }
            state.chats[chatId].messages = messages;
        },

        removeChat(state, action) {
            const chatId = action.payload;
            delete state.chats[chatId];

            if (state.currentChatId === chatId) {
                state.currentChatId = null;
            }
        },
        

    }

});

export const { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, removeChat } = chatSlice.actions;
export default chatSlice.reducer;