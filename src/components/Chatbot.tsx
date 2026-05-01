import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Music, Loader2, Sparkles, Play, ExternalLink } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import type { Song } from '../types';

/* ── Mini Playlist Card (shown inline in chat) ── */
const MiniPlaylistCard = ({ song, index }: { song: Song; index: number }) => {
  const handlePlay = () => {
    const query = encodeURIComponent(`${song.title} ${song.artist}`);
    window.open(`https://youtube.com/search?q=${query}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="chatbot-playlist-card group"
    >
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <span className="text-xs font-bold text-orange-400/60 mt-0.5 flex-shrink-0">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-sm text-slate-800 truncate">{song.title}</h4>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-orange-100/60 text-orange-600 uppercase tracking-wider flex-shrink-0">
              {song.genre}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">{song.artist}</p>
          <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-1">"{song.vibeNote}"</p>
        </div>
      </div>
      <button
        onClick={handlePlay}
        className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500/10 hover:bg-orange-500/20 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
        title="Play on YouTube"
      >
        <Play size={12} className="text-orange-500 ml-0.5" />
      </button>
    </motion.div>
  );
};

/* ── Main Chatbot Component ── */
export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, isTyping, isGeneratingPlaylist, sendMessage, generatePlaylistFromChat, clearChat } = useChatbot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isGeneratingPlaylist]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGeneratePlaylist = () => {
    generatePlaylistFromChat();
  };

  const quickPrompts = [
    "I'm feeling really happy today ☀️",
    "Had a rough day, feeling low 😔",
    "I need some party vibes! 🎉",
  ];

  // Check if user has sent at least 1 message (beyond welcome)
  const userHasSpoken = messages.some(m => m.role === 'user');

  return (
    <>
      {/* ── Floating Chat Bubble ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="chatbot-toggle"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="chatbot-fab"
            aria-label="Open chat"
          >
            <MessageCircle size={28} className="text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="chatbot-fab-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-window"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="chatbot-window"
          >
            {/* ── Header ── */}
            <div className="chatbot-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-md shadow-orange-500/30">
                  <Music size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-base leading-tight">
                    MoodWave AI
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
                    <span className="text-[11px] text-slate-500">by Vanshika Bansal</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-2 rounded-xl hover:bg-white/40 transition-colors text-slate-400 hover:text-slate-600"
                  title="Clear chat"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/40 transition-colors text-slate-400 hover:text-slate-600"
                  title="Close chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── Divider ── */}
            <div className="h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />

            {/* ── Messages Area ── */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'chatbot-msg-user rounded-2xl rounded-br-md'
                        : 'chatbot-msg-ai rounded-2xl rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* ── Inline Playlist Cards ── */}
                  {msg.playlist && (
                    <div className="w-full mt-3 space-y-1.5 max-w-[95%]">
                      {msg.playlist.songs.map((song, i) => (
                        <MiniPlaylistCard key={i} song={song} index={i} />
                      ))}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex items-center gap-2 mt-3 px-2"
                      >
                        <ExternalLink size={12} className="text-slate-400" />
                        <span className="text-[11px] text-slate-400">Click any song to find it on YouTube</span>
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* ── Typing Indicator ── */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="chatbot-msg-ai rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <div className="chatbot-typing-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Generating Playlist Indicator ── */}
              {isGeneratingPlaylist && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="chatbot-msg-ai rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-orange-500" />
                    <span className="text-sm text-slate-500 italic">Crafting your playlist...</span>
                  </div>
                </motion.div>
              )}

              {/* ── Quick Prompts (only on welcome) ── */}
              {messages.length === 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col gap-2 mt-2"
                >
                  <p className="text-[11px] text-slate-400 px-1 uppercase tracking-wider">Quick start</p>
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt)}
                      className="chatbot-quick-prompt"
                    >
                      {prompt}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Generate Playlist Button (appears after user talks) ── */}
            {userHasSpoken && !isGeneratingPlaylist && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-4 pb-1"
              >
                <button
                  onClick={handleGeneratePlaylist}
                  disabled={isTyping || isGeneratingPlaylist}
                  className="chatbot-generate-btn"
                >
                  <Sparkles size={15} className="text-orange-400" />
                  <span>Generate Playlist from Chat</span>
                </button>
              </motion.div>
            )}

            {/* ── Divider ── */}
            <div className="h-px bg-gradient-to-r from-transparent via-orange-300/40 to-transparent" />

            {/* ── Input Area ── */}
            <div className="chatbot-input-area">
              <input
                ref={inputRef}
                id="chatbot-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Share your thoughts..."
                disabled={isTyping || isGeneratingPlaylist}
                className="chatbot-input"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={!input.trim() || isTyping || isGeneratingPlaylist}
                className="chatbot-send-btn"
                aria-label="Send message"
              >
                <Send size={16} className="text-white ml-0.5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
