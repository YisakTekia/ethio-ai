import dotenv from 'dotenv';

dotenv.config();

export const getGeminiResponse = async (userMessage: string, domain: string, previousContext: string): Promise<string> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    // 1. ቁልፉ በትክክል .env ውስጥ መኖሩን እናረጋግጣለን
    if (!apiKey || apiKey.trim() === '') {
      throw new Error("GEMINI_API_KEY is missing or empty in your .env file!");
    }

    // 2. የ RootGate መመሪያዎች (Persona)
    let systemInstruction = "You are a helpful assistant named RootGate AI (Star Think). Always reply in the exact language the user uses to ask the question (support Amharic, English, Afaan Oromo, and Tigrinya).";

    if (domain === 'sports_entertainment') {
      systemInstruction = `You are RootGate AI, an expert in Sports and Entertainment. ONLY answer questions related to sports and entertainment. Always reply politely in the exact language the user uses to ask the question (Amharic, English, Afaan Oromo, or Tigrinya). If they ask in English, reply in English.`;
    } else if (domain === 'health') {
      systemInstruction = `You are RootGate AI, a health assistant. ONLY answer health questions. Always reply politely in the exact language the user uses to ask the question (Amharic, English, Afaan Oromo, or Tigrinya). If they ask in English, reply in English.`;
    } else if (domain === 'education') {
      systemInstruction = `You are RootGate AI, an education assistant. ONLY answer education questions. Always reply politely in the exact language the user uses to ask the question (Amharic, English, Afaan Oromo, or Tigrinya). If they ask in English, reply in English.`;
    }

    const promptText = `System Instructions:\n${systemInstruction}\n\n--- Previous Context ---\n${previousContext}\n\nUser: ${userMessage}\nAI:`;

    // 3. ያለምንም ፓኬጅ በቀጥታ ወደ Google ሰርቨር እንልካለን (Direct Fetch)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    const data = await response.json();

    // 4. Google እምቢ ካለ፣ ምክንያቱን ደብቆ እንዳያስቀር በግልጽ እናወጣዋለን
    if (!response.ok) {
      console.error("\n❌ [GOOGLE DIRECT API ERROR]:", JSON.stringify(data, null, 2), "\n");
      throw new Error(data.error?.message || "Google API request failed");
    }

    // 5. መልሱን በሰላም ከተቀበልን፣ ወደ ፊትለፊት እንመልሰዋለን
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('AI returned an empty response.');
    }

  } catch (error: any) {
    // ይሄ ትክክለኛውን ስህተት ተርሚናልህ ላይ ቁልጭ አድርጎ ያሳየናል!
    console.error('[CHAT CONTROLLER ERROR]:', error.message || error);
    throw new Error(`AI Error: ${error.message}`);
  }
};