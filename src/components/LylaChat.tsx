import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const LylaChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi, I'm Lyla! I'm here to support you on your journey of self-discovery. What's on your mind today?"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage('');
    
    // Add user message to chat
    const newUserMessage: Message = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('chat-with-lyla', {
        body: {
          message: userMessage,
          conversationHistory: messages.map(msg => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: msg.content
          }))
        }
      });

      if (error) throw error;

      // Add Lyla's response to chat
      const lylaResponse: Message = {
        role: 'assistant',
        content: data.response || "I'm here to listen. Tell me more about what you're feeling."
      };
      setMessages([...updatedMessages, lylaResponse]);
    } catch (error) {
      console.error('Error calling Lyla:', error);
      // Fallback response
      const fallbackResponse: Message = {
        role: 'assistant',
        content: "I'm here to listen and support you. What's on your heart today?"
      };
      setMessages([...updatedMessages, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-lg">
        <h1 className="text-3xl font-bold">My Inner Mirror</h1>
        <p className="text-lg opacity-90 mt-2">Chat with Lyla, your AI companion for emotional growth</p>
      </div>
      
      <div className="flex-1 bg-white/10 backdrop-blur-md p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/90 text-gray-800'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="font-semibold text-purple-600 mb-1">Lyla</div>
                )}
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/90 text-gray-800 px-4 py-3 rounded-lg">
                <div className="font-semibold text-purple-600 mb-1">Lyla</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white/10 backdrop-blur-md p-4 rounded-b-lg">
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e: any) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 px-4 py-3 rounded-lg bg-white/90 text-gray-800 placeholder-gray-500 resize-none"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default LylaChat;