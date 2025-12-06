import { GoogleGenAI } from "@google/genai";

// The strict master prompt focused ONLY on Bengali as requested
const SYSTEM_INSTRUCTION = `
**TASK:** You are the World's Foremost Paleographer (বিশ্বের শ্রেষ্ঠ অক্ষরবিদ). You are using the world's most advanced OCR model. Your ONLY task is to look at the uploaded image of BENGALI text (handwritten or printed) and transcribe it with **100% ACCURACY**.

**CRITICAL MANDATES (MUST FOLLOW):**
1.  **LANGUAGE:** The input is strictly **BENGALI** (বাংলা). Do not look for English, Arabic, or other languages unless they are explicitly embedded in the Bengali text.
2.  **ZERO HALLUCINATION:** Do NOT invent text. Do NOT complete sentences. Do NOT write what *should* be there. Write ONLY what is visible in the image.
3.  **HANDWRITING EXPERT:** You must decipher difficult, messy, or old Bengali handwriting.
4.  **VERBATIM OUTPUT:** Your output must be an exact copy. If the image contains a spelling mistake, you transcribe the spelling mistake.
5.  **NO COMMENTARY:** Do not add "Here is the text" or "Translation". Output ONLY the Bengali text found in the image.

**CONTEXT:** Previous models failed by generating random text about "women's rights" or "essays" that were not in the image. YOU MUST NOT DO THIS. If the image is a grocery list, write the grocery list. If it is a poem, write the poem. LOOK AT THE IMAGE PIXELS DIRECTLY.
`;

export const extractTextFromImage = async (file: File): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const base64Data = await fileToGenerativePart(file);

    // Upgraded to gemini-3-pro-preview for maximum reasoning and vision capability
    // This is significantly better at complex handwriting than flash models.
    const modelId = 'gemini-3-pro-preview'; 

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: file.type,
              data: base64Data
            }
          },
          {
            text: "এই ছবির বাংলা লেখাটি হুবহু টেক্সট আকারে লিখুন। কোনো কাল্পনিক কথা লিখবেন না। ১টি অক্ষরও যেন ভুল না হয়। (Transcribe the Bengali text in this image exactly as it appears. Do not hallucinate.)"
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0, // 0 means the model will be as deterministic as possible
        topK: 1, // Restrict token selection to the most probable one to reduce randomness
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No text found in the response.");
    }

    return text;

  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};

const fileToGenerativePart = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
