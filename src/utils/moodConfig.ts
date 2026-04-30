import type { MoodConfig } from '../types';

export const MOODS: MoodConfig[] = [
  { id: 'happy', label: 'Happy', emoji: '😊', glowColor: '#FF6B35', tailwindGlow: 'shadow-orange-500/50' },
  { id: 'sad', label: 'Sad', emoji: '😢', glowColor: '#6366F1', tailwindGlow: 'shadow-indigo-500/50' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡', glowColor: '#F59E0B', tailwindGlow: 'shadow-amber-500/50' },
  { id: 'romantic', label: 'Romantic', emoji: '💕', glowColor: '#E11D6A', tailwindGlow: 'shadow-rose-600/50' },
  { id: 'focused', label: 'Focused', emoji: '🎯', glowColor: '#10B981', tailwindGlow: 'shadow-emerald-500/50' },
  { id: 'chill', label: 'Chill', emoji: '🌊', glowColor: '#38BDF8', tailwindGlow: 'shadow-sky-500/50' },
  { id: 'angry', label: 'Angry', emoji: '🔥', glowColor: '#EF4444', tailwindGlow: 'shadow-red-500/50' },
  { id: 'melancholic', label: 'Melancholic', emoji: '🌙', glowColor: '#8B5CF6', tailwindGlow: 'shadow-violet-500/50' },
  { id: 'motivated', label: 'Motivated', emoji: '💪', glowColor: '#FF9A5C', tailwindGlow: 'shadow-orange-300/50' },
  { id: 'anxious', label: 'Anxious', emoji: '🌀', glowColor: '#A78BFA', tailwindGlow: 'shadow-purple-400/50' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🍃', glowColor: '#34D399', tailwindGlow: 'shadow-emerald-400/50' },
  { id: 'party', label: 'Party', emoji: '🎉', glowColor: '#F472B6', tailwindGlow: 'shadow-pink-400/50' }
];
