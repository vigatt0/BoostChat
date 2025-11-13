'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import io, { Socket } from 'socket.io-client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/pricing');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Conectar ao WebSocket
      const socketInstance = io(process.env.NEXT_PUBLIC_CHATBOT_API_URL || 'http://localhost:3001', {
        query: { userId: user.uid },
      });

      socketInstance.on('connected', (data) => {
        console.log('Conectado:', data.message);
        setConnected(true);
      });

      socketInstance.on('messageReceived', (data) => {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date(data.timestamp),
        };
        setMessages((prev) => [...prev, newMessage]);
        setIsTyping(false);
      });

      socketInstance.on('typing', (data) => {
        setIsTyping(data.isTyping);
      });

      socketInstance.on('error', (data) => {
        console.error('Erro:', data.message);
        alert(data.message);
        setIsTyping(false);
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [user]);

  useEffect(() => {
    // Scroll para o fim quando nova mensagem chega
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = () => {
    if (!input.trim() || !socket || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Enviar mensagem via WebSocket
    socket.emit('sendMessage', {
      userId: user.uid,
      message: input,
    });

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearConversation = () => {
    if (socket && user) {
      socket.emit('clearConversation', { userId: user.uid });
      setMessages([]);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BoostChat
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}
                ></div>
                <span className="text-sm text-gray-600">
                  {connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>
              <button
                onClick={handleClearConversation}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
              >
                Limpar
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Comece uma conversa!
              </h3>
              <p className="text-gray-600">
                Digite sua mensagem abaixo para começar a conversar com o BoostChat
              </p>
            </div>
          )}

          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] px-6 py-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white px-6 py-4 rounded-2xl shadow-md">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-4 py-4 flex-shrink-0">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
              rows={1}
              disabled={!connected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || !connected}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
