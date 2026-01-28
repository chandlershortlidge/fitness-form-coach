import React, { useState } from 'react';

// Variation 2: Split-Panel Q&A Interface
// Side-by-side layout with input on left, output on right
// Great for testing/debugging where you want to see both clearly

export default function ChatbotWireframeV2() {
  const [question, setQuestion] = useState('What are the benefits of exercise?');
  const [response, setResponse] = useState('Regular exercise offers numerous health benefits including improved cardiovascular health, stronger muscles and bones, better mental health, weight management, and increased energy levels. Studies show even 30 minutes of moderate activity daily can significantly improve overall well-being.');
  const [history, setHistory] = useState([
    { q: 'Hello', a: 'Hi! How can I help you today?' },
    { q: 'What is AI?', a: 'AI (Artificial Intelligence) refers to computer systems designed to perform tasks that typically require human intelligence.' },
  ]);

  const handleSubmit = () => {
    if (!question.trim()) return;
    setHistory([...history, { q: question, a: response }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="text-center mb-2">
          <span className="text-xs uppercase tracking-wider text-gray-400 font-mono">Wireframe V2</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center">Split-Panel Q&A Interface</h1>
        <p className="text-gray-500 text-center mt-1">Side-by-side input/output for testing workflows</p>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto">
        {/* Top Controls */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-t-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-sm text-gray-500">
              Model: [Dropdown]
            </div>
            <div className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-sm text-gray-500">
              Temperature: [Slider]
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-sm text-gray-500">
              Clear
            </button>
            <button className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-sm text-gray-500">
              Export
            </button>
          </div>
        </div>

        {/* Split Panels */}
        <div className="flex border-2 border-t-0 border-dashed border-gray-300 rounded-b-lg overflow-hidden">
          {/* Left Panel - Input */}
          <div className="w-1/2 bg-white border-r-2 border-dashed border-gray-300">
            <div className="bg-gray-50 px-4 py-2 border-b-2 border-dashed border-gray-300">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Input / Question</span>
            </div>
            <div className="p-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here..."
                className="w-full h-48 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:border-gray-400"
              />
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-400">{question.length} characters</span>
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg text-gray-600 font-medium hover:bg-gray-300 transition-colors"
                >
                  Submit Query →
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="w-1/2 bg-gray-50">
            <div className="bg-gray-100 px-4 py-2 border-b-2 border-dashed border-gray-300 flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Output / Response</span>
              <span className="text-xs text-gray-400">⏱ 1.2s</span>
            </div>
            <div className="p-4">
              <div className="w-full h-48 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white text-gray-600 overflow-y-auto">
                {response || <span className="text-gray-400 italic">Response will appear here...</span>}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs text-gray-400">{response.length} characters • 47 tokens</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-500">
                    Copy
                  </button>
                  <button className="px-3 py-1 bg-gray-100 border border-dashed border-gray-300 rounded text-xs text-gray-500">
                    Rate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Panel */}
        <div className="mt-4 bg-white border-2 border-dashed border-gray-300 rounded-lg">
          <div className="bg-gray-50 px-4 py-2 border-b-2 border-dashed border-gray-300 flex justify-between items-center">
            <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">Test History</span>
            <span className="text-xs text-gray-400">{history.length} queries</span>
          </div>
          <div className="max-h-40 overflow-y-auto">
            {history.map((item, idx) => (
              <div key={idx} className="flex border-b border-dashed border-gray-200 last:border-0">
                <div className="w-1/2 p-3 text-sm text-gray-600 border-r border-dashed border-gray-200 truncate">
                  <span className="text-gray-400 mr-2">Q:</span>{item.q}
                </div>
                <div className="w-1/2 p-3 text-sm text-gray-500 truncate">
                  <span className="text-gray-400 mr-2">A:</span>{item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Annotations */}
      <div className="max-w-6xl mx-auto mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-medium text-yellow-800 mb-2">Design Notes:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Side-by-side comparison ideal for testing/QA</li>
          <li>• Easy to see input and output simultaneously</li>
          <li>• History panel for tracking test sessions</li>
          <li>• Metadata (timing, tokens) useful for debugging</li>
        </ul>
      </div>
    </div>
  );
}
