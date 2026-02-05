// Centralized API utility using fetch for all backend calls
// Update baseURL if your backend runs on a different port or domain

const baseURL = (import.meta?.env?.VITE_API_BASE_URL || 'http://127.0.0.1:5000');

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function apiGet(path) {
  const res = await fetch(baseURL + path, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location?.pathname !== '/login') {
        window.location.assign('/login');
      }
      throw new Error('Session expired. Please log in again.');
    }
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.msg || json.error || json.message || text);
    } catch {
      throw new Error(text);
    }
  }
  return res.json();
}


export async function apiPost(path, data) {
  const res = await fetch(baseURL + path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location?.pathname !== '/login') {
        window.location.assign('/login');
      }
      throw new Error('Session expired. Please log in again.');
    }
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      throw new Error(json.msg || json.error || json.message || text);
    } catch {
      throw new Error(text);
    }
  }
  return res.json();
}
