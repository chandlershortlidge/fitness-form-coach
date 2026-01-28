import React, { useState } from 'react';

// Variation 1: Classic Chat Interface
// A familiar messaging-style layout with messages flowing vertically

export default function ChatbotWireframeV1() {
  const [messages, setMessages] = useState([
    { id: 1, type: 'user', text: 'What is the capital of France?' },
    { id: 2, type: 'bot', text: 'The capital of France is Paris. It is the largest city in France and serves as the country\'s political, economic, and cultural center.' },
    { id: 3, type: 'user', text: 'Tell me more about it.' },
    { id: 4, type: 'bot', text: 'Paris is known for landmarks like the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral. It has a population of about 2.1 million in the city proper.' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), type: 'user', text: input }]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="text-center mb-2">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-mono">Wireframe V1</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">Classic Chat Interface</h1>
        <p className="text-gray-500 text-center mt-1">Familiar messaging-style vertical flow</p>
      </div>

      {/* Chat Container */}
      <div className="max-w-2xl mx-auto bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gray-50 border-b-2 border-dashed border-gray-300 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">BOT</span>
            </div>
            <div>
              <div className="font-medium text-gray-700">Chatbot Name</div>
              <div className="text-xs text-gray-400">● Online</div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">⚙</div>
            <div className="w-8 h-8 bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">↻</div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg border-2 border-dashed ${
                msg.type === 'user'
                  ? 'bg-gray-200 border-gray-400 text-gray-700'
                  : 'bg-white border-gray-300 text-gray-600'
              }`}>
                <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
                  {msg.type === 'user' ? 'User Input' : 'Bot Response'}
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-dashed border-gray-300 p-4 bg-white">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={handleSend}
              className="px-6 py-3 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 font-medium hover:bg-gray-300 transition-colors"
            >
              Send →
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-400 text-center">
            [Input field] • [Send button]
          </div>
        </div>
      </div>

      {/* Annotations */}
      <div className="max-w-2xl mx-auto mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Design Notes:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Familiar chat bubble layout users recognize</li>
          <li>• Clear visual distinction between user/bot messages</li>
          <li>• Simple input at bottom, always visible</li>
          <li>• Scrollable conversation history</li>
        </ul>
      </div>
    </div>
  );
}
