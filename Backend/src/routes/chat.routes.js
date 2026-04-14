import { Router } from 'express';
import { authUser } from '../middleware/auth.middleware.js';
import { sendMessage , getChats,getMessages,deleteChat} from '../controllers/chat.controller.js';
const chatRouter = Router();


chatRouter.post('/messages', authUser, sendMessage) 
chatRouter.get('/', authUser, getChats)
chatRouter.get('/:chatId/messages', authUser, getMessages)

chatRouter.delete('/delete/:chatId', authUser,deleteChat)
export default chatRouter