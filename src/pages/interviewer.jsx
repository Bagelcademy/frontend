import React, { useState } from 'react';
import img6 from '../assets/5.png';


const Interviewer = () => {
  const [sessionId, setSessionId] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    const payload = {
      session_id: sessionId,
      message,
      ...(sessionId
        ? {}
        : {
            position: 'Software Engineer',
            major: 'Computer Science',
            expertise: 'AI Development',
            experience: '3 years at tech companies',
          }),
    };

    try {
      const response = await fetch('/api/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ken', // Include the "ken" token in the Authorization header
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      setChatHistory([
        ...chatHistory,
        { sender: 'User', content: message },
        { sender: 'Interviewer', content: data.bot_message },
      ]);
      setSessionId(data.session_id);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <img src={img6} alt="Interviewer" className="w-24 h-24 mx-auto rounded-full" />
          <h1 className="text-4xl font-bold text-blue-500 dark:text-blue-400 mt-4">AI Interviewer</h1>
          <p className="text-gray-600 dark:text-gray-300">Powered by AI</p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="chat-history max-h-96 overflow-y-auto mb-4">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-4 ${chat.sender === 'User' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block px-4 py-2 rounded-lg ${
                    chat.sender === 'User'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {chat.content}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <button
              onClick={sendMessage}
              className="ml-4 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 dark:hover:bg-blue-400 transition"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interviewer;
