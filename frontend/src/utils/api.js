const BASE_URL = 'http://localhost:8000';

export async function analyze({ sessionId, userQuery, userVideo, userAudio }) {
  const form = new FormData();
  form.append('session_id', sessionId);

  if (userQuery) form.append('user_query', userQuery);
  if (userVideo) form.append('user_video', userVideo);
  if (userAudio) form.append('user_audio', userAudio, 'recording.webm');

  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}
