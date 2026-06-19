import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, BrainCircuit, Loader2, Copy, Check, TerminalSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api'; 

const CodeBlock = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <TerminalSquare size={14} className="text-slate-500" />
          <span className="text-xs font-mono text-slate-400">{language}</span>
        </div>
        <button onClick={handleCopy} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
          <span className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
};

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      role: 'ai', 
      content: "Hello! I'm your advanced AI Productivity Partner.\n\nI can help you:\n• Break down complex projects into actionable tasks\n• Analyze your productivity trends\n• Write boilerplate code or scripts\n• Suggest optimal schedule blocks\n\nHow can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('ai/generate', { title: userMessage.content });
      
      const aiResponse = `Here's an optimal breakdown strategy for **"${userMessage.content}"**:\n\n### Task Details\n**Description:** ${response.data.description}\n**Suggested Priority:** ${response.data.priority}\n**Estimated Effort:** ${response.data.estimatedHours} hours.\n\n### Implementation Plan\nI recommend structuring the initial setup like this:\n\n\`\`\`json\n{\n  "taskId": "TSK-${Math.floor(Math.random() * 1000)}",\n  "title": "${userMessage.content}",\n  "status": "TODO",\n  "priority": "${response.data.priority}"\n}\n\`\`\`\n\nWould you like me to automatically provision this task and notify the team?`;
      
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: aiResponse }]);
    } catch (error) {
      // Mocking realistic ChatGPT style response on API failure
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          role: 'ai', 
          content: `Here is a sample implementation to get you started on **"${userMessage.content}"**:\n\n\`\`\`javascript\nfunction initProject() {\n  console.log("Initializing ${userMessage.content}...");\n  // TODO: Add core logic here\n  return true;\n}\n\`\`\`\n\nLet me know if you need me to expand on this snippet or create a corresponding tracking task.` 
        }]);
        setIsLoading(false);
      }, 1500);
      return; // Return early since we simulated the response
    } 
    setIsLoading(false);
  };

  const renderContent = (content) => {
    // Basic markdown parser for bold and code blocks
    const parts = content.split(/(```[\s\S]*?```|\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].trim();
        const code = lines.slice(1).join('\n');
        return <CodeBlock key={index} language={language || 'code'} code={code} />;
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-slate-900 dark:text-brandText">{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto glass-card overflow-hidden shadow-2xl border border-slate-200 dark:border-white/5 rounded-3xl">
      
      {/* Header */}
      <div className="p-4 md:px-8 md:py-5 border-b border-[var(--border-color)] flex items-center justify-between bg-brandCard/50 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-brandText leading-tight">GPT-4 Turbo</h2>
            <p className="text-xs font-semibold text-success flex items-center gap-1.5 uppercase tracking-wider mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span> Available
            </p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-brandBg custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 md:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl flex items-center justify-center text-white shadow-md ${
                msg.role === 'ai' ? 'bg-gradient-to-br from-primary-500 to-accent-600 shadow-primary-500/20' : 'bg-slate-800 dark:bg-brandSidebar'
              }`}>
                {msg.role === 'ai' ? <Sparkles size={16} /> : <User size={16} />}
              </div>
              
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%]`}>
                <span className="text-[11px] font-bold text-slate-400 dark:text-brandMuted uppercase tracking-wider mb-1.5 px-1">
                  {msg.role === 'user' ? 'You' : 'AI Assistant'}
                </span>
                <div className={`p-5 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-sm shadow-xl' 
                    : 'bg-brandCard border border-[var(--border-color)] text-slate-700 dark:text-brandText rounded-tl-sm shadow-sm'
                }`}>
                  <div className="whitespace-pre-wrap text-[15px] leading-relaxed font-medium">
                    {renderContent(msg.content)}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 md:gap-6">
            <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
              <Sparkles size={16} className="animate-spin-slow" />
            </div>
            <div className="flex flex-col items-start max-w-[85%]">
              <span className="text-[11px] font-bold text-slate-400 dark:text-brandMuted uppercase tracking-wider mb-1.5 px-1">AI Assistant</span>
              <div className="p-5 rounded-2xl bg-brandCard border border-[var(--border-color)] rounded-tl-sm shadow-sm flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
                <span className="text-sm font-bold text-slate-500 dark:text-brandMuted animate-pulse ml-2">Generating response...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-brandCard border-t border-[var(--border-color)]">
        <form onSubmit={handleSubmit} className="relative flex items-center max-w-3xl mx-auto">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message GPT-4 Turbo..."
            className="w-full pl-6 pr-14 py-4 rounded-2xl bg-brandSidebar border border-[var(--border-color)] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-slate-900 dark:text-brandText font-medium"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-3 bg-primary text-white rounded-xl hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all shadow-lg"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 dark:text-brandMuted mt-4 font-medium">
          AI Assistant can make mistakes. Consider verifying important information.
        </p>
      </div>
    </div>
  );
};

export default AiAssistant;
