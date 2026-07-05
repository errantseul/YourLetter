const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options) {
  const res = await fetch(`${API_BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || body.errors?.join(', ') || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export const createLetter = (letter) => request('/letters', { method: 'POST', body: JSON.stringify(letter) });

export const updateLetter = (id, letter) => request(`/letters/${id}`, { method: 'PATCH', body: JSON.stringify(letter) });

export const getLetter = (id) => request(`/letters/${id}`);
