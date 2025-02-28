import { chatModel } from "../../../DB/model/chat.model.js";
import { companyModel } from "../../../DB/model/company.model.js";
import {io} from '../socket.controllet.js'

export const handleChat = async (socket) => {
    socket.on('chat', async ({ userId, currentUserId, message }) => {
      try {
        const company = await companyModel.findOne({
          $or: [
            { createdBy: currentUserId },
            { HR: currentUserId }
          ]
        });
  
        if (!company && !message) {
          socket.emit('error', 'Only company owners or HR can start a conversation');
          return;
        }
  
        let chat = await chatModel.findOne({
          $or: [
            { senderId: currentUserId, receiverId: userId },
            { senderId: userId, receiverId: currentUserId }
          ]
        });
  
        if (!chat) {
          chat = new chatModel({ senderId: currentUserId, receiverId: userId, messages: [] });
        }
  
        if (message) {
          const newMessage = { message, senderId: currentUserId };
          chat.messages.push(newMessage);
          await chat.save();
  
          io.to(userId).emit('receiveMessage', newMessage);
        } else {
          socket.emit('chatHistory', chat.messages);
        }
      } catch (error) {
        console.error('Chat operation error:', error);
        socket.emit('error', 'Chat operation error');

      }
    });
  };
  