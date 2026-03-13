// src/controllers/chatController.ts
import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import Chat from '../models/chat';
import { getGeminiResponse } from '../utils/gemini';

// Handle incoming new chat messages
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

    // Get the last 6 messages to provide context to the AI
    const recentMessages = chat.messages.slice(-6);
    const previousContext = recentMessages
      .map(m => `${m.isBot ? 'AI' : 'User'}: ${m.text}`)
      .join('\n');

    // Fetch response from Gemini AI
    const aiReply = await getGeminiResponse(message, domain, previousContext);

    // Save user message and AI reply to the database
    chat.messages.push({ text: message, isBot: false, timestamp: new Date() });
    chat.messages.push({ text: aiReply, isBot: true, timestamp: new Date() });
    await chat.save();

    res.status(200).json({ status: 'success', reply: aiReply });
  } catch (error) {
    console.error('[CHAT CONTROLLER ERROR]:', error);
    res.status(500).json({ status: 'error', message: 'An internal server error occurred while processing the chat.' });
  }
};

// ==========================================
// NEW: Fetch Chat History for the user
// ==========================================
export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { domain } = req.query; // e.g., ?domain=sports_entertainment
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ status: 'error', message: 'User not authenticated.' });
      return;
    }

    if (!domain) {
      res.status(400).json({ status: 'error', message: 'Domain query parameter is required.' });
      return;
    }

    // Find the chat document for this user and domain
    const chat = await Chat.findOne({ userId, domain });

    // Format the messages to match the frontend expected structure
    const formattedHistory = chat ? chat.messages.map((m: any) => ({
      id: m._id ? m._id.toString() : Date.now().toString() + Math.random().toString(), // Generate fallback ID if missing
      text: m.text,
      isBot: m.isBot
    })) : [];

    res.status(200).json({ status: 'success', history: formattedHistory });
  } catch (error) {
    console.error('[GET CHAT HISTORY ERROR]:', error);
    res.status(500).json({ status: 'error', message: 'An error occurred while fetching chat history.' });
  }
};