import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Message = ({ isBot, content, timestamp }) => (
  <div className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'} mb-4`}>
    <div className={`w-8 h-8 rounded-full flex items-center justify-center 
      ${isBot ? 'bg-blue-500' : 'bg-slate-700 dark:bg-slate-600'}`}>
      {isBot ? <Bot size={18} className="text-white" /> : <User size={18} className="text-white" />}
    </div>
    <div className={`flex-1 ${isBot ? 'mr-12' : 'ml-12'}`}>
      <div className={`p-3 rounded-lg ${
        isBot 
          ? 'bg-slate-100 dark:bg-slate-800' 
          : 'bg-blue-500 text-white dark:bg-blue-600'
      }`}>
        {isBot ? (
          <div className="markdown-content prose dark:prose-invert max-w-none prose-pre:my-0 prose-p:my-0 prose-ul:my-0 prose-ol:my-0">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-1 last:mb-0">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-1 last:mb-0">{children}</ol>,
                li: ({ children }) => <li className="mb-1 last:mb-0">{children}</li>,
                code: ({ inline, children }) => 
                  inline ? (
                    <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm">{children}</code>
                  ) : (
                    <pre className="bg-slate-200 dark:bg-slate-700 p-2 rounded overflow-x-auto">
                      <code className="text-sm">{children}</code>
                    </pre>
                  ),
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 my-2">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          content
        )}
      </div>
      <div className="text-xs text-slate-400 mt-1">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  </div>
);

const AIAssistant = ({ lessonContent }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Add welcome message when component mounts
    setMessages([{
      id: Date.now(),
      content: t('chat.welcomeMessage'),
      isBot: true,
      timestamp: new Date(),
    }]);
  }, [t]); // Add t as dependency since we're using it in the effect

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const contextMessage = `this is the lesson that i will ask question about and dont answer not related questions: ${lessonContent} \n\n${input}`;

      const response = await fetch('https://bagelapi.bagelcademy.org/account/chat/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: contextMessage }),
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: data.response,
        isBot: true,
        timestamp: new Date(),
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now(),
        content: t('chat.errorMessage'),
        isBot: true,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="shrink-0 py-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          {t('chat.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 p-4 pt-0">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-slate-400">
                {t('chat.emptyState')}
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <Message key={message.id} {...message} />
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-center py-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="mt-4 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder={t('chat.inputPlaceholder')}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 p-0"
            aria-label={t('chat.aria.sendButton')}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;