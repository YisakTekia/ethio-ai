// src/controllers/chatController.ts
import { Request, Response } from 'express';
import { getGeminiResponse } from '../utils/gemini';

/**
 * Handles incoming chat messages and communicates with the AI (Mock DB Mode).
 */
export const handleChatMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, domain } = req.body;

    if (!message || !domain) {
      res.status(400).json({ status: 'error', message: 'Message and domain are required.' });
      return;
    }

    // 🔴 ሙሉ ጊዜያዊ MOCK (MongoDB አያስፈልገውም) 🔴
    // የድሮ ቻት ሂስትሪ ከዳታቤዝ ከማምጣት ይልቅ ባዶ አድርገን እንልከዋለን
    const previousContext = "";

    // 1. ጥያቄውን ቀጥታ ወደ Gemini AI እንልካለን
    const aiReply = await getGeminiResponse(message, domain, previousContext);

    // 2. መልሱን ለዳታቤዝ ሳንሰጥ ቀጥታ ወደ Frontend (Vercel) እንመልሳለን
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