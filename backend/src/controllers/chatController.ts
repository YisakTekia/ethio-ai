// src/controllers/chatController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import Chat from '../models/chat';
import { getGeminiResponse } from '../utils/gemini';

export const handleChatMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, domain } = req.body;
    const userId = req.user?._id; 

    if (!userId) {
      res.status(401).json({ status: 'error', message: 'User not authenticated.' });
      return;
    }

    let chat = await Chat.findOne({ userId, domain });
    if (!chat) {
      chat = new Chat({ userId, domain, messages: [] });
    }

    const recentMessages = chat.messages.slice(-6);
    const previousContext = recentMessages
      .map(m => `${m.isBot ? 'AI' : 'User'}: ${m.text}`)
      .join('\n');

    const aiReply = await getGeminiResponse(message, domain, previousContext);

    chat.messages.push({ text: message, isBot: false, timestamp: new Date() });
    chat.messages.push({ text: aiReply, isBot: true, timestamp: new Date() });
    await chat.save();

    res.status(200).json({ status: 'success', reply: aiReply });
  } catch (error) {
    console.error('[CHAT CONTROLLER ERROR]:', error);
    res.status(500).json({ status: 'error', message: 'An internal server error occurred while processing the chat.' });
  }
};