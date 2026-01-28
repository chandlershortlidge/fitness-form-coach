import React, { useState } from 'react';

// Variation 3: Card-Based Conversation Interface
// Each Q&A pair is a discrete card, good for reviewing/comparing responses

export default function ChatbotWireframeV3() {
  const [input, setInput] = useState('');
  const [cards, setCards] = useState([
    {
      id: 1,
      question: 'Explain quantum computing in simple terms',
      answer: 'Quantum computing uses quantum mechanics to process information. Unlike regular computers that use bits (0 or 1), quantum computers use qubits that can be both 0 and 1 at the same time. This allows them to solve certain complex problems much faster.',
      timestamp: '2 min ago',
      rating: 'good',
    },
    {
      id: 2,
      question: 'What are some practical applications?',
      answer: 'Practical applications include drug discovery (simulating molecular interactions), cryptography (breaking and creating secure codes), financial modeling (optimizing portfolios), and weather forecasting (processing vast climate data).',
      timestamp: '1 min ago',
      rating: null,
    },
  ]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setCards([...cards, {
      id: Date.now(),
      question: input,
      answer: 'Loading response...',
      timestamp: 'Just now',
      rating: null,
    }]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="text-center mb-2">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-mono">Wireframe V3</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">Card-Based Q&A Interface</h1>
        <p className="text-gray-500 text-center mt-1">Each exchange as a discrete, reviewable card</p>
      </div>

      {/* Input Section - Fixed at Top */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4">
          <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">New Question</div>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Ask a question..."
              className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 font-medium hover:bg-gray-300 transition-colors"
            >
              Ask →
            </button>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="max-w-3xl mx-auto space-y-4">
        {cards.map((card) => (
          <div key={card.id} className="bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-gray-50 px-4 py-2 border-b-2 border-dashed border-gray-300 flex justify-between items-center">
              <span className="text-xs text-gray-400">#{card.id} • {card.timestamp}</span>
              <div className="flex gap-1">
                <button className="w-6 h-6 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-400 hover:bg-gray-200">✎</button>
                <button className="w-6 h-6 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-400 hover:bg-gray-200">⋮</button>
              </div>
            </div>

            {/* Question Section */}
            <div className="p-4 border-b-2 border-dashed border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-500">U</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Question</div>
                  <p className="text-gray-700">{card.question}</p>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="p-4 bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-gray-600">AI</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Response</div>
                  <p className="text-gray-600">{card.answer}</p>
                </div>
              </div>
            </div>

            {/* Card Footer - Rating & Actions */}
            <div className="px-4 py-3 border-t-2 border-dashed border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Rate:</span>
                <button className={`px-2 py-1 border border-dashed rounded text-xs ${card.rating === 'good' ? 'bg-green-100 border-green-300 text-green-600' : 'border-gray-300 text-gray-400'}`}>
                  👍 Good
                </button>
                <button className={`px-2 py-1 border border-dashed rounded text-xs ${card.rating === 'bad' ? 'bg-red-100 border-red-300 text-red-600' : 'border-gray-300 text-gray-400'}`}>
                  👎 Poor
                </button>
              </div>
              <div className="flex gap-2">
                <button className="px-2 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-500">
                  Copy
                </button>
                <button className="px-2 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-500">
                  Retry
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State Placeholder */}
        {cards.length === 0 && (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl text-gray-300">?</span>
            </div>
            <p className="text-gray-400">No conversations yet</p>
            <p className="text-sm text-gray-300 mt-1">Ask a question to get started</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="max-w-3xl mx-auto mt-6">
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-around">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700">{cards.length}</div>
            <div className="text-xs text-gray-400 uppercase">Total Q&A</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{cards.filter(c => c.rating === 'good').length}</div>
            <div className="text-xs text-gray-400 uppercase">Good</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{cards.filter(c => c.rating === 'bad').length}</div>
            <div className="text-xs text-gray-400 uppercase">Poor</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">{cards.filter(c => !c.rating).length}</div>
            <div className="text-xs text-gray-400 uppercase">Unrated</div>
          </div>
        </div>
      </div>

      {/* Annotations */}
      <div className="max-w-3xl mx-auto mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Design Notes:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Each Q&A pair is a self-contained, reviewable unit</li>
          <li>• Built-in rating system for quality tracking</li>
          <li>• Easy to scan, compare, and evaluate responses</li>
          <li>• Summary stats help track testing progress</li>
        </ul>
      </div>
    </div>
  );
}
