export function getSessionId() {
  let id = sessionStorage.getItem('session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('session_id', id);
  }
  return id;
}

export function resetSessionId() {
  const id = crypto.randomUUID();
  sessionStorage.setItem('session_id', id);
  return id;
}

const HISTORY_KEY = 'session_history';
const MAX_HISTORY = 20;

export function getSessionHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveSessionEntry(entry) {
  const history = getSessionHistory();
  // Replace if same session id exists, otherwise prepend
  const idx = history.findIndex((h) => h.id === entry.id);
  if (idx !== -1) {
    history[idx] = entry;
  } else {
    history.unshift(entry);
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}
