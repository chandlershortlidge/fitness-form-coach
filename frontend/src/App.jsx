import { useState, useCallback } from 'react';
import ChatPanel from './components/ChatPanel';
import InputBar from './components/InputBar';
import { analyze } from './utils/api';
import { getSessionId } from './utils/session';

const sessionId = getSessionId();

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  async function sendToBackend(payload) {
    setIsLoading(true);
    try {
      const data = await analyze({ sessionId, ...payload });
      addMessage({ role: 'coach', text: data.response });
    } catch {
      addMessage({ role: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSendText(text) {
    addMessage({ role: 'user', text });
    sendToBackend({ userQuery: text });
  }

  function handleSendVideo(file, textInput) {
    addMessage({ role: 'user', text: `📎 ${file.name}` });
    sendToBackend({
      userVideo: file,
      userQuery: textInput || 'Analyze my form',
    });
  }

  function handleSendAudio(blob) {
    addMessage({ role: 'user', text: '🎙️ Voice message' });
    sendToBackend({ userAudio: blob });
  }

  return (
    <div className="app">
      <h1 className="app-title">Fitness Form Coach</h1>
      <div className="chat-panel">
        <ChatPanel messages={messages} isLoading={isLoading} />
        <InputBar
          onSendText={handleSendText}
          onSendVideo={handleSendVideo}
          onSendAudio={handleSendAudio}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}
