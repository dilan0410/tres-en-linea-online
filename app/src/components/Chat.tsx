import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import type { ChatMessage } from '@/types/game';

interface ChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  playerName: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function Chat({ messages, onSendMessage, playerName, isOpen, onToggle }: ChatProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('es', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        onClick={onToggle}
        className={`
          fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300 btn-press
          ${isOpen 
            ? 'bg-[#D93877] text-white shadow-lg shadow-pink-500/30' 
            : 'glass text-white hover:bg-[#D93877]/20'
          }
        `}
      >
        <MessageCircle className="w-6 h-6" />
        {messages.length > 0 && !isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D93877] text-white text-xs flex items-center justify-center font-bold">
            {messages.length}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[340px] max-h-[400px] glass rounded-2xl flex flex-col overflow-hidden animate-slide-in-up shadow-2xl">
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#D93877]" />
              <span className="text-white font-bold text-sm font-pixel">CHAT</span>
            </div>
            <span className="text-xs text-gray-500">{messages.length} msgs</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[280px]">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-xs font-pixel">Escribe para chatear...</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMine = msg.sender === playerName;
              const symbolColor = msg.symbol === 'X' ? '#D93877' : '#E4A11B';
              
              return (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span 
                      className="text-[10px] font-bold"
                      style={{ color: symbolColor }}
                    >
                      {msg.symbol}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {msg.sender}
                    </span>
                    <span className="text-[9px] text-gray-600">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <div 
                    className={`
                      px-3 py-2 rounded-xl max-w-[85%] text-sm
                      ${isMine 
                        ? 'bg-[#D93877]/30 text-white rounded-br-sm' 
                        : 'bg-[#252830] text-gray-200 rounded-bl-sm'
                      }
                    `}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                maxLength={100}
                className="
                  flex-1 bg-[#252830] rounded-xl px-3 py-2 text-sm text-white
                  placeholder-gray-500 outline-none border border-white/5
                  focus:border-[#D93877]/50 transition-colors
                "
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="
                  w-10 h-10 rounded-xl bg-[#D93877] text-white flex items-center justify-center
                  hover:bg-[#D93877]/80 disabled:opacity-30 disabled:cursor-not-allowed
                  transition-all btn-press
                "
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
