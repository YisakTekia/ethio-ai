// src/controllers/chatController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware'; // <-- Add this
import Chat from '../models/chat';
import { getGeminiResponse } from '../utils/gemini';

/**
 * Handles incoming chat messages, manages chat history, and communicates with the AI.
 */
export const handleChatMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { message, domain } = req.body;

    // Get the REAL user ID from the protected middleware
    const userId = req.user?._id; 

    if (!userId) {
      res.status(401).json({ status: 'error', message: 'User not authenticated.' });
      return;
    }


    // 2. Fetch existing chat history for this specific user and domain
    let chat = await Chat.findOne({ userId, domain });
    if (!chat) {
      // Create a new chat document if this is their first time in this domain
      chat = new Chat({ userId, domain, messages: [] });
    }

    // 3. Format the last 6 messages to provide context without exceeding token limits
    const recentMessages = chat.messages.slice(-6);
    const previousContext = recentMessages
      .map(m => `${m.isBot ? 'AI' : 'User'}: ${m.text}`)
      .join('\n');

    // 4. Send request to Gemini AI utility
    const aiReply = await getGeminiResponse(message, domain, previousContext);

    // 5. Append both user message and AI reply to the database document
    chat.messages.push({ text: message, isBot: false, timestamp: new Date() });
    chat.messages.push({ text: aiReply, isBot: true, timestamp: new Date() });
    await chat.save();

    // 6. Return the AI's response back to the client (Frontend)
    res.status(200).json({ 
      status: 'success', 
      reply: aiReply 
    });

  } catch (error) {
    console.error('[CHAT CONTROLLER ERROR]:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'An internal server error occurred while processing the chat.' 
    });
  }
};