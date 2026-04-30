import { useState } from 'react';
import type { PlaylistResponse } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

const buildPrompt = (mood: string): string => `
You are a world-class music curator AI.
The user is feeling: "${mood}"

Generate a playlist of exactly 10 Bollywood songs that perfectly match this mood.

Respond ONLY in this exact JSON format (no markdown, no explanation):
{
  "vibeDescription": "One sentence describing the emotional vibe of this playlist",
  "songs": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "genre": "Genre",
      "vibeNote": "One short sentence on why this fits the mood"
    }
  ]
}

Rules:
- Include real, well-known Bollywood songs that actually exist
- Vary the genres (don't use all one genre)
- Mix popular and deeper cuts
- Make the vibeNote feel poetic and personal
- Genre should be 1-2 words max
`;

export const useGemini = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlaylist = async (mood: string): Promise<PlaylistResponse | null> => {
    if (!GEMINI_API_KEY) {
      setError("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: buildPrompt(mood)
            }]
          }]
        })
      });

      if (!response.ok) { const text = await response.text(); try { const json = JSON.parse(text); if (json.error) throw new Error(json.error.message); } catch (e) { if (e.message !== 'Unexpected end of JSON input' && !e.message.startsWith('Unexpected token')) throw e; } throw new Error(`API request failed with status ${response.status}: ${text}`); }

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        throw new Error("No response generated from Gemini.");
      }

      // Strip potential markdown fences
      let jsonString = rawText.trim();
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.slice(7);
      }
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.slice(3);
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.slice(0, -3);
      }
      jsonString = jsonString.trim();

      const parsed: PlaylistResponse = JSON.parse(jsonString);

      // Basic validation
      if (!parsed.vibeDescription || !Array.isArray(parsed.songs) || parsed.songs.length === 0) {
        throw new Error("Invalid response structure from Gemini.");
      }

      setIsLoading(false);
      return parsed;
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate playlist. Please try again.");
      setIsLoading(false);
      return null;
    }
  };

  return { generatePlaylist, isLoading, error };
};
