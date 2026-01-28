import React, { useState } from 'react';

// RAG Testing Interface
// Focused on error-testing: see questions, responses, sources, and flag failures

export default function RAGTester() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      question: 'What is our refund policy?',
      answer: 'Our refund policy allows returns within 30 days of purchase. Items must be unused and in original packaging. Refunds are processed within 5-7 business days.',
      sources: ['refund-policy.pdf (p.2)', 'faq.md'],
      time: '0.8s',
      status: 'pass',
    },
    {
      id: 2,
      question: 'How do I contact support on weekends?',
      answer: 'You can reach our support team via email at support@company.com. Phone support is available Monday through Friday.',
      sources: ['contact.md'],
      time: '1.2s',
      status: 'fail',
      note: 'Didn\'t answer weekend hours - info missing from docs?',
    },
    {
      id: 3,
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, American Express, PayPal, and Apple Pay.',
      sources: ['checkout-guide.pdf (p.1)', 'faq.md'],
      time: '0.6s',
      status: null,
    },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      question: input,
      answer: 'Processing...',
      sources: [],
      time: '—',
      status: null,
    }]);
    setInput('');
  };

  const toggleStatus = (id, newStatus) => {
    setMessages(messages.map(m =>
      m.id === id ? { ...m, status: m.status === newStatus ? null : newStatus } : m
    ));
  };

  const updateNote = (id, note) => {
    setMessages(messages.map(m => m.id === id ? { ...m, note } : m));
  };

  const stats = {
    total: messages.length,
    pass: messages.filter(m => m.status === 'pass').length,
    fail: messages.filter(m => m.status === 'fail').length,
    unreviewed: messages.filter(m => !m.status).length,
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-700 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">RAG Tester</h1>
            <p className="text-sm text-gray-500">Test questions → Find failures</p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-500">{stats.total} tests</span>
            <span className="text-green-500">✓ {stats.pass}</span>
            <span className="text-red-500">✗ {stats.fail}</span>
            <span className="text-gray-500">○ {stats.unreviewed}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-3xl mx-auto py-6 px-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-lg border ${
              msg.status === 'fail' ? 'border-red-500/50 bg-red-950/20' :
              msg.status === 'pass' ? 'border-green-500/30 bg-gray-800/50' :
              'border-gray-700 bg-gray-800/50'
            }`}
          >
            {/* Question */}
            <div className="px-4 py-3 border-b border-gray-700/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Question</span>
                  <p className="text-gray-100 mt-1">{msg.question}</p>
                </div>
                <span className="text-xs text-gray-600">{msg.time}</span>
              </div>
            </div>

            {/* Answer */}
            <div className="px-4 py-3">
              <span className="text-xs text-gray-500 uppercase tracking-wider">Response</span>
              <p className="text-gray-300 mt-1">{msg.answer}</p>

              {/* Sources */}
              {msg.sources.length > 0 && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-600">Sources:</span>
                  {msg.sources.map((src, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-gray-700 rounded text-gray-400">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-4 py-2 border-t border-gray-700/50 flex items-center gap-2">
              <button
                onClick={() => toggleStatus(msg.id, 'pass')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  msg.status === 'pass'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                ✓ Pass
              </button>
              <button
                onClick={() => toggleStatus(msg.id, 'fail')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  msg.status === 'fail'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                ✗ Fail
              </button>
              <input
                type="text"
                placeholder="Add note..."
                value={msg.note || ''}
                onChange={(e) => updateNote(msg.id, e.target.value)}
                className="flex-1 ml-2 px-3 py-1 bg-gray-700/50 border border-gray-600 rounded text-xs text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Input - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a test question..."
            className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-gray-600"
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 font-medium transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
