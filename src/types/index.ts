export interface Song {
  title: string;
  artist: string;
  genre: string;
  vibeNote: string;
}

export interface PlaylistResponse {
  vibeDescription: string;
  songs: Song[];
}

export interface MoodConfig {
  id: string;
  label: string;
  emoji: string;
  glowColor: string;
  tailwindGlow: string;
}
