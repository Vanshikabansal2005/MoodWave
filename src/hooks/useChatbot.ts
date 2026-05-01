import { useState, useCallback } from 'react';
import type { PlaylistResponse } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  playlist?: PlaylistResponse;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are MoodWave AI — the built-in assistant of MoodWave, a mood-based music playlist generator developed by Vanshika Bansal.

CRITICAL IDENTITY RULES:
- You are MoodWave AI. You were created by Vanshika Bansal.
- NEVER mention Google, Gemini, or any other AI model. You are MoodWave AI, period.
- If asked "who made you" or "who are you", say: "I'm MoodWave AI — your personal music companion! MoodWave is a mood-based music playlist generator developed by Vanshika Bansal 🎵"
- If asked about your technology, say you're powered by MoodWave's proprietary music intelligence.

Your personality:
- Warm, enthusiastic, and slightly poetic
- You love Bollywood music but know global music too
- You speak concisely (2-4 sentences usually)
- You use occasional music emojis (🎵 🎶 🎧 🎤 💿) but don't overdo it

Your purpose:
- Listen to users share their thoughts, feelings, and current mood
- Be empathetic and understanding about their emotions
- Help them discover music that matches their current state of mind
- When you sense they've shared enough about their mood, gently suggest they can generate a playlist by clicking the "Generate Playlist" button below

Rules:
- Keep responses SHORT and conversational (under 120 words)
- Be empathetic when users share personal feelings
- Relate their emotions to music naturally
- After 2-3 exchanges about their mood, mention: "Whenever you're ready, hit the ✨ Generate Playlist button below and I'll create a personalized playlist based on our conversation!"
- If asked about non-music topics, gently steer back to music/moods
- Never use markdown headers — keep it chat-friendly
- Never break character as MoodWave AI`;

const PLAYLIST_PROMPT_PREFIX = `You are MoodWave AI. Based on the following conversation with a user, analyze their mood and emotional state, then generate a playlist of exactly 10 Bollywood songs that perfectly match how they're feeling.

Here is the conversation:
`;

const PLAYLIST_PROMPT_SUFFIX = `

Respond ONLY in this exact JSON format (no markdown, no explanation):
{
  "vibeDescription": "One sentence describing the emotional vibe of this playlist based on the conversation",
  "songs": [
    {
      "title": "Song Title",
      "artist": "Artist Name",
      "genre": "Genre",
      "vibeNote": "One short sentence on why this fits their mood"
    }
  ]
}

Rules:
- Include real, well-known Bollywood songs that actually exist
- Vary the genres
- Mix popular and deeper cuts
- Make the vibeNote feel personal, referencing the user's shared feelings
- Genre should be 1-2 words max
- The vibeDescription should feel like it was crafted specifically for this user`;

export const useChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey there! 🎵 I'm MoodWave AI — your personal music companion, developed by Vanshika Bansal. Share what's on your mind, how you're feeling, or what kind of day you're having — and I'll help you find the perfect soundtrack!",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isGeneratingPlaylist, setIsGeneratingPlaylist] = useState(false);

  const callGemini = async (contents: Array<{ role: string; parts: Array<{ text: string }> }>) => {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  };

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || !GEMINI_API_KEY) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const allMessages = [...messages, userMsg].slice(-12);

      const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "Understood! I'm MoodWave AI, created by Vanshika Bansal. I'll be a warm, music-focused companion. Let's find some great vibes! 🎵" }] },
        ...allMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        })),
      ];

      const rawText = await callGemini(contents);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: rawText.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chatbot error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "Oops, my signal dropped for a sec! 🎧 Could you try that again? I'm all ears for your vibes.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const generatePlaylistFromChat = useCallback(async (): Promise<PlaylistResponse | null> => {
    if (!GEMINI_API_KEY || messages.length < 2) return null;

    setIsGeneratingPlaylist(true);

    try {
      // Build conversation transcript
      const transcript = messages
        .filter(m => m.id !== 'welcome')
        .map(m => `${m.role === 'user' ? 'User' : 'MoodWave AI'}: ${m.content}`)
        .join('\n');

      const contents = [
        {
          role: 'user',
          parts: [{ text: PLAYLIST_PROMPT_PREFIX + transcript + PLAYLIST_PROMPT_SUFFIX }],
        },
      ];

      const rawText = await callGemini(contents);

      // Strip markdown fences
      let jsonString = rawText.trim();
      if (jsonString.startsWith('```json')) jsonString = jsonString.slice(7);
      if (jsonString.startsWith('```')) jsonString = jsonString.slice(3);
      if (jsonString.endsWith('```')) jsonString = jsonString.slice(0, -3);
      jsonString = jsonString.trim();

      const parsed: PlaylistResponse = JSON.parse(jsonString);

      if (!parsed.vibeDescription || !Array.isArray(parsed.songs) || parsed.songs.length === 0) {
        throw new Error('Invalid response structure');
      }

      // Add playlist message to chat
      const playlistMsg: ChatMessage = {
        id: `playlist-${Date.now()}`,
        role: 'assistant',
        content: `🎶 Here's your personalized playlist! "${parsed.vibeDescription}"`,
        timestamp: new Date(),
        playlist: parsed,
      };

      setMessages(prev => [...prev, playlistMsg]);
      return parsed;
    } catch (err) {
      console.error('Playlist generation error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I had trouble creating your playlist 😔 Could you share a bit more about your mood? That'll help me find the perfect songs for you!",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      return null;
    } finally {
      setIsGeneratingPlaylist(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: "Fresh start! 🎵 I'm MoodWave AI — tell me what's on your mind and let's find your perfect soundtrack!",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, isTyping, isGeneratingPlaylist, sendMessage, generatePlaylistFromChat, clearChat };
};
