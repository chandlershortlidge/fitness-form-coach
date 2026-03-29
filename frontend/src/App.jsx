import { useState, useCallback, useEffect, useRef } from 'react';
import ChatPanel from './components/ChatPanel';
import InputBar from './components/InputBar';
import Sidebar from './components/Sidebar';
import { analyze } from './utils/api';
import { getSessionId, resetSessionId, getSessionHistory, saveSessionEntry } from './utils/session';

export default function App() {
  const [sessionId, setSessionId] = useState(getSessionId);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const videoUrlRef = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [sessionHistory, setSessionHistory] = useState(getSessionHistory);
  const [searchQuery, setSearchQuery] = useState('');

  // Create/revoke object URL when videoFile changes
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      videoUrlRef.current = url;
      setVideoUrl(url);
    } else {
      setVideoUrl(null);
    }
    return () => {
      if (videoUrlRef.current) {
        URL.revokeObjectURL(videoUrlRef.current);
        videoUrlRef.current = null;
      }
    };
  }, [videoFile]);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateMessage = useCallback((index, updates) => {
    setMessages((prev) => prev.map((m, i) => (i === index ? { ...m, ...updates } : m)));
  }, []);

  function handleNewSession() {
    const newId = resetSessionId();
    setSessionId(newId);
    setMessages([]);
    setVideoFile(null);
    setPreviewData(null);
    setIsLoading(false);
    setLoadingType(null);
  }

  function handleSelectSession(id) {
    // Future: load session from backend. For now, just switch the active marker.
    console.log('[sidebar] selected session:', id);
  }

  function saveToHistory(label) {
    const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const entry = { id: sessionId, label, date };
    saveSessionEntry(entry);
    setSessionHistory(getSessionHistory());
  }

  async function sendToBackend(payload, userMsgIndex, type = 'text') {
    setIsLoading(true);
    setLoadingType(type);
    try {
      await analyze({
        sessionId,
        ...payload,
        onResponse(response, transcription) {
          if (transcription && userMsgIndex != null) {
            updateMessage(userMsgIndex, { text: `🎙️ ${transcription}` });
          }
          addMessage({ role: 'coach', text: response });
          // Save a history entry from the first line of the response
          const label = response.split('\n').find((l) => l.trim()) || 'Text analysis';
          saveToHistory(label.slice(0, 50));
        },
      });
    } catch (err) {
      console.error('[sendToBackend] error:', err);
      addMessage({ role: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
      setLoadingType(null);
    }
  }

  function handleSendText(text) {
    addMessage({ role: 'user', text });
    sendToBackend({ userQuery: text });
  }

  async function handleSendVideo(file, textInput) {
    const display = textInput
      ? `📎 ${file.name}\n${textInput}`
      : `📎 ${file.name}`;
    addMessage({ role: 'user', text: display });
    setVideoFile(file);
    setIsLoading(true);
    setLoadingType('video');
    setPreviewData(null);

    try {
      await analyze({
        sessionId,
        userVideo: file,
        userQuery: textInput || 'Analyze my form',
        onStatus(message) {
          console.log('[sse] status:', message);
        },
        onPreview(classifiedKeywords) {
          console.log('[sse] preview:', classifiedKeywords);
          setPreviewData(classifiedKeywords);
        },
        onResponse(response) {
          addMessage({ role: 'coach', text: response });
          // Use the file name as the history label for video analyses
          const label = file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
          saveToHistory(label);
        },
      });
    } catch (err) {
      console.error('[sendToBackend] error:', err);
      addMessage({ role: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
      setLoadingType(null);
      setPreviewData(null);
    }
  }

  function handleSendAudio(blob) {
    const idx = messages.length;
    addMessage({ role: 'user', text: '🎙️ Voice message' });
    sendToBackend({ userAudio: blob }, idx);
  }

  // Build session list for sidebar
  const sidebarSessions = sessionHistory.map((s) => ({
    ...s,
    active: s.id === sessionId,
  }));

  return (
    <div className={`app${videoUrl ? ' has-video' : ''}`}>
      <Sidebar
        sessions={sidebarSessions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
      />
      <div className="app-main">
        <h1 className="app-title">Fitness Form Coach</h1>
        <div className="app-layout">
          <div className="chat-panel">
            <ChatPanel messages={messages} isLoading={isLoading} loadingType={loadingType} previewData={previewData} />
            <InputBar
              onSendText={handleSendText}
              onSendVideo={handleSendVideo}
              onSendAudio={handleSendAudio}
              disabled={isLoading}
            />
          </div>
          {videoUrl && (
            <div className="video-panel">
              <div className="video-panel-header">
                <span className="video-panel-title">Your Video</span>
                <button
                  className="video-panel-close"
                  onClick={() => setVideoFile(null)}
                  aria-label="Close video panel"
                >
                  ✕
                </button>
              </div>
              <video
                className="video-player"
                src={videoUrl}
                controls
                playsInline
                preload="metadata"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
