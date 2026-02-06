// Centralized API utility using fetch for all backend calls
// In dev, prefer same-origin '/api' so Vite proxy works reliably.
// In prod, set VITE_API_BASE_URL if the backend is on a different origin.

const envBaseURL = import.meta?.env?.VITE_API_BASE_URL;
const baseURL = envBaseURL ?? (import.meta?.env?.DEV ? '' : 'http://localhost:5000');

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function apiGet(path) {
  let res;
  try {
    res = await fetch(baseURL + path, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  } catch (err) {
    throw new Error(
      `Cannot reach backend API. ` +
        `Start the server (root: npm run dev, or server: npm run dev:server) ` +
        `or set VITE_API_BASE_URL. (${err?.message || 'network error'})`
    );
  }
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
      const extractedMsg = /"msg"\s*:\s*"([^"]+)"/.exec(text)?.[1];
      throw new Error(extractedMsg || text);
    }
  }
  return res.json();
}


export async function apiPost(path, data) {
  let res;
  try {
    res = await fetch(baseURL + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
  } catch (err) {
    throw new Error(
      `Cannot reach backend API. ` +
        `Start the server (root: npm run dev, or server: npm run dev:server) ` +
        `or set VITE_API_BASE_URL. (${err?.message || 'network error'})`
    );
  }
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
      const extractedMsg = /"msg"\s*:\s*"([^"]+)"/.exec(text)?.[1];
      throw new Error(extractedMsg || text);
    }
  }
  return res.json();
}
