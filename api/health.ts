import { GoogleGenAI } from '@google/genai';

function getGeminiClient(): GoogleGenAI | null {
  const rawKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    '';

  const apiKey = rawKey.trim().replace(/^["']|["']$/g, '');

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 10) {
    return null;
  }

  try {
    return new GoogleGenAI({
      apiKey,
    });
  } catch (e) {
    return null;
  }
}

export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  const client = getGeminiClient();
  const rawKey =
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    '';

  return res.status(200).json({
    status: 'ok',
    hasApiKey: Boolean(client),
    keyConfigured: Boolean(rawKey && rawKey.length > 5),
    timestamp: new Date().toISOString(),
  });
}
