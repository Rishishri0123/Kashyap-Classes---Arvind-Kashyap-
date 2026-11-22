import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, Send, Sparkles, MessageSquare, Phone, ChevronRight, BookOpen, Calendar, Award, Code2, Layers, Download, CheckCircle2, Lock } from 'lucide-react';
import { useContactUnlock } from '../context/ContactUnlockContext';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
  actionLink?: {
    label: string;
    onClickType: 'demo' | 'brochure' | 'call' | 'whatsapp' | 'ncert' | 'lab' | 'notes' | 'map';
  };
}

interface AiCounselorBotProps {
  onOpenInquiry: (initialCourse?: string) => void;
  onDownloadBrochure: () => void;
}

export const AiCounselorBot: React.FC<AiCounselorBotProps> = ({ onOpenInquiry, onDownloadBrochure }) => {
  const navigate = useNavigate();
  const { isUnlocked, phoneNumber, phoneTel, whatsappUrl, maskedPhone, openUnlockModal } = useContactUnlock();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const botName = 'Kashyap AI Sahayak';

  const initialBotMessage: Message = {
    id: 'welcome-1',
    sender: 'bot',
    text: `Namaste! 🙏 I am **${botName}**, the official virtual academic counselor and master physics mentor for **Kashyap Classes**.\n*(Website Designed & Engineered by **Rishi Shrivastav**)*\n\nI have complete knowledge of our institute, physical center, and deep physics concepts across CBSE Boards, JEE, NEET, and Olympiads (including HC Verma & Irodov). How can I guide you today?`,
    timestamp: 'Just now',
    suggestions: [
      'Class 12 Notes (All 14 Ch)',
      'Center Location & Google Map',
      'Advanced Physics (Irodov / HCV)',
      'Class 12 Board Derivations & YDSE',
      'Class 12 Concept Simulation Lab',
      'Download NCERT Physics PDFs',
      'Book Free Trial Demo Class',
      'Who developed this website?',
    ],
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Determine intelligent contextual action link based on query or response
  const detectActionLink = (query: string, reply: string): Message['actionLink'] | undefined => {
    const combined = (query + ' ' + reply).toLowerCase();
    if (combined.includes('note') || combined.includes('handwritten')) {
      return { label: 'Open Class 12 Notes (14 Ch)', onClickType: 'notes' };
    }
    if (combined.includes('map') || combined.includes('direction') || combined.includes('shastri nagar') || combined.includes('where') || combined.includes('location')) {
      return { label: 'View Center on Google Maps', onClickType: 'map' };
    }
    if (combined.includes('simulation') || combined.includes('lab') || combined.includes('ydse') || combined.includes('lenz')) {
      return { label: 'Explore Class 12 Concept Lab', onClickType: 'lab' };
    }
    if (combined.includes('ncert') || combined.includes('textbook') || combined.includes('pdf')) {
      return { label: 'Go to NCERT Physics PDF Hub', onClickType: 'ncert' };
    }
    if (combined.includes('demo') || combined.includes('trial') || combined.includes('register') || combined.includes('enroll') || combined.includes('free class')) {
      return { label: 'Book Free 2-Hour Trial Class', onClickType: 'demo' };
    }
    if (combined.includes('brochure') || combined.includes('syllabus')) {
      return { label: 'Download Course Brochure (PDF)', onClickType: 'brochure' };
    }
    if (combined.includes('contact') || combined.includes('call') || combined.includes('helpline')) {
      return {
        label: isUnlocked ? `Call Arvind Kashyap (${phoneNumber})` : `Unlock Contact Number (${maskedPhone})`,
        onClickType: 'call',
      };
    }
    return { label: 'Book Free Trial Demo', onClickType: 'demo' };
  };

  // Generate dynamic, context-specific follow-up suggestions
  const generateDynamicSuggestions = (query: string, reply: string): string[] => {
    const q = (query + ' ' + reply).toLowerCase();
    const phoneOption = isUnlocked ? `Call ${phoneNumber}` : 'Unlock Direct Number';

    if (q.includes('note') || q.includes('handwritten')) {
      return ['Unlock Class 12 Notes', 'View Center on Google Map', 'Book Free Trial Class'];
    }
    if (q.includes('map') || q.includes('location') || q.includes('address')) {
      return ['Driving Directions to Center', 'Class 12 Notes (All 14 Ch)', 'Book Offline Trial Demo'];
    }
    if (q.includes('online') || q.includes('record')) {
      return ['100% Offline Classroom Policy', 'Book Free Trial Class', phoneOption];
    }
    if (q.includes('rishi') || q.includes('developer') || q.includes('creator')) {
      return ['Try Class 12 Simulation Lab', 'Class 12 Notes (14 Ch)', 'Download NCERT Physics'];
    }
    if (q.includes('class 12') || q.includes('ydse') || q.includes('optics')) {
      return ['Class 12 Handwritten Notes', 'Try Wave Optics Simulator', 'Download Class 12 NCERT PDF'];
    }
    if (q.includes('class 11') || q.includes('kinematics') || q.includes('rotation')) {
      return ['Class 11 Batch Timings', 'Download Class 11 NCERT', 'Book Free Demo with Sir'];
    }
    if (q.includes('neet') || q.includes('medical') || q.includes('aiims')) {
      return ['NEET Batch Timings', 'Class 12 High-Yield Notes', 'Download NCERT Physics'];
    }
    if (q.includes('jee') || q.includes('iit') || q.includes('advanced')) {
      return ['JEE Problem Topologies', 'Class 12 Handwritten Notes', 'Speak with Kashyap Sir'];
    }
    if (q.includes('fee') || q.includes('cost') || q.includes('payment')) {
      return ['Book Free Trial Demo', 'Download Syllabus Brochure', phoneOption];
    }
    if (q.includes('timing') || q.includes('schedule')) {
      return ['Book Free Trial Slot', 'Class 12 Morning Batch', 'Class 11 Evening Batch'];
    }
    return ['Class 12 Notes (All 14 Ch)', 'Center Google Map', 'Try Class 12 Simulation', 'Book Free Trial Demo'];
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const botMessageId = `bot-${Date.now()}`;
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Build chat history for multi-turn context
    const historyPayload = messages.slice(-4).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    try {
      // 1. Real-time streaming response for instantaneous feedback
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyPayload }),
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let hasAppendedBot = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const rawChunk = decoder.decode(value, { stream: true });
          const lines = rawChunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk;

                  if (!hasAppendedBot) {
                    hasAppendedBot = true;
                    setIsTyping(false);
                    setMessages((prev) => [
                      ...prev,
                      {
                        id: botMessageId,
                        sender: 'bot',
                        text: accumulatedText,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ]);
                  } else {
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === botMessageId ? { ...m, text: accumulatedText } : m
                      )
                    );
                  }
                }
              } catch {
                // Ignore parse errors on chunk boundaries
              }
            }
          }
        }

        if (accumulatedText) {
          setIsTyping(false);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMessageId
                ? {
                    ...m,
                    text: accumulatedText,
                    suggestions: generateDynamicSuggestions(text, accumulatedText),
                    actionLink: detectActionLink(text, accumulatedText),
                  }
                : m
            )
          );
          return;
        }
      }
    } catch (e) {
      console.warn('Streaming failed, attempting fast fallback:', e);
    }

    // 2. High-speed standard fallback endpoint
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: historyPayload }),
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.reply;

        if (replyText) {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: botMessageId,
              sender: 'bot',
              text: replyText,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              suggestions: generateDynamicSuggestions(text, replyText),
              actionLink: detectActionLink(text, replyText),
            },
          ]);
          return;
        }
      }
    } catch (e) {
      console.warn('Standard fallback error:', e);
    }

    // High quality intelligent client fallback if network disconnected
    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        sender: 'bot',
        text: `At **Kashyap Classes**, Arvind Kashyap (Kashyap Sir) personally teaches conceptual physics for Class 11, Class 12, JEE, and NEET.\n\n*(Website Developed & Created by Rishi Shrivastav)*\n\n• **Official NCERT PDFs**: Available in our NCERT Physics Hub.\n• **Class 12 Lab**: Test our live interactive Wave Optics (YDSE) and Lenz's Law simulators.\n• **Free Trial**: Attend a Free 2-Hour Live Trial Class.\n• **Direct Helpline**: ${isUnlocked ? `Call or WhatsApp ${phoneNumber}.` : `Helpline: ${maskedPhone} (Submit inquiry form to unlock number).`}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: ['Explore Class 12 Lab', 'Download NCERT Physics', 'Book Free Trial Demo'],
        actionLink: { label: 'Book Free Trial Demo', onClickType: 'demo' },
      },
    ]);
  };

  const handleActionClick = (actionType?: string) => {
    if (actionType === 'demo') {
      onOpenInquiry('Free 2-Hour Live Physics Trial Class');
    } else if (actionType === 'brochure') {
      onDownloadBrochure();
    } else if (actionType === 'notes') {
      setIsOpen(false);
      navigate('/notes');
    } else if (actionType === 'map') {
      setIsOpen(false);
      navigate('/location');
    } else if (actionType === 'ncert') {
      setIsOpen(false);
      navigate('/ncert');
    } else if (actionType === 'lab') {
      setIsOpen(false);
      navigate('/lab');
    } else if (actionType === 'call') {
      if (isUnlocked) {
        window.location.href = phoneTel;
      } else {
        openUnlockModal('To call Arvind Kashyap Sir directly');
      }
    } else if (actionType === 'whatsapp') {
      if (isUnlocked) {
        window.open(whatsappUrl, '_blank');
      } else {
        openUnlockModal('To chat directly on WhatsApp with Arvind Kashyap Sir');
      }
    }
  };

  return (
    <>
      {/* Bot Floating Trigger Button (Bottom-Left) - Small, Compact, Non-Obtrusive */}
      {/* Bot Floating Trigger Button (Bottom-Left) - Logo Colors */}
      <div className="fixed bottom-4 left-3 sm:left-4 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-[#0c2340] hover:bg-[#071527] text-white rounded-full shadow-lg border border-[#14325c] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ring-2 ring-[#ff6600]/50"
            aria-label="Ask Kashyap AI Sahayak"
            title="Ask Kashyap AI Sahayak"
          >
            <div className="w-6 h-6 rounded-full bg-[#ff6600] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            
            {/* Small status indicator dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6600] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6600] border border-[#0c2340]" />
            </span>

            {/* Subtle Desktop Tooltip on Hover */}
            <span className="hidden sm:group-hover:inline-block absolute left-12 bg-[#0c2340] text-white text-[10px] font-bold py-1 px-2.5 rounded-lg whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none">
              Ask AI · Developed by Rishi Shrivastav
            </span>
          </button>
        )}
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 left-3 sm:left-4 z-50 w-[92vw] sm:w-[410px] h-[540px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden animate-fade-in font-sans">
          
          {/* Header with Logo Deep Navy */}
          <div className="bg-gradient-to-r from-[#071527] via-[#0c2340] to-[#14325c] text-white p-3.5 flex items-center justify-between border-b border-[#071527]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#ff6600] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-white font-heading">
                    {botName}
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
                </div>
                <span className="text-[10px] text-orange-200 font-medium">
                  Physics Counselor · Created by Rishi Shrivastav
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Notice Banner with helpline */}
          <div className="bg-[#fff7f0] px-3 py-1 border-b border-[#fed7aa] text-[10px] text-[#0c2340] font-semibold flex items-center justify-between">
            <span>⚡ Complete knowledge of website & courses</span>
            {isUnlocked ? (
              <span className="text-[#ff6600] font-bold">Helpline: {phoneNumber}</span>
            ) : (
              <button
                onClick={() => openUnlockModal('To view Kashyap Sir’s direct telephone helpline')}
                className="text-[#ff6600] font-bold hover:underline cursor-pointer flex items-center gap-1"
                title="Enter details to unlock helpline"
              >
                <Lock className="w-2.5 h-2.5" />
                <span>Helpline: {maskedPhone} (Unlock)</span>
              </button>
            )}
          </div>

          {/* Messages Container with Smooth Overscroll Contain */}
          <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y p-3.5 space-y-3 bg-slate-50/90 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl shadow-2xs leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-[#0c2340] text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}

                  {/* Contextual Action Callout Button */}
                  {msg.actionLink && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleActionClick(msg.actionLink?.onClickType)}
                        className="w-full py-2 px-3 bg-[#ff6600] hover:bg-[#ea580c] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-kc-orange active:scale-98"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-current" />
                        <span>{msg.actionLink.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Dynamic suggestions pills attached to the latest bot message */}
                {msg.suggestions && msg.id === messages[messages.length - 1].id && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.suggestions.map((sug, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[10px] font-semibold bg-white hover:bg-blue-50 text-blue-950 px-2.5 py-1 rounded-full border border-blue-200 shadow-2xs transition-all hover:scale-102 active:scale-98 cursor-pointer text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-2.5 bg-white rounded-2xl border border-slate-200 w-fit shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-950 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-blue-950 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-blue-950 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-slate-700 font-medium ml-1">Analyzing website & formulating detailed answer...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="p-2.5 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about Class 12, YDSE, NCERT, Timings, Creator..."
                className="flex-1 text-xs px-3 py-2.5 bg-slate-100 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:bg-white transition-all text-slate-900"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="p-2.5 bg-blue-950 text-amber-400 rounded-xl hover:bg-blue-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs active:scale-95"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Developer Attribution Footer in AI Bot */}
            <div className="text-[9px] text-center text-slate-600 mt-1.5 font-medium flex items-center justify-center gap-1">
              <Code2 className="w-3 h-3 text-amber-600" />
              <span>Website Developed & Created by <strong>Rishi Shrivastav</strong></span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
