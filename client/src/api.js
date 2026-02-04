// Centralized API utility using fetch for all backend calls
// Update baseURL if your backend runs on a different port or domain


const baseURL = '';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


export async function apiGet(path) {
  const res = await fetch(baseURL + path, {
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
    },
  });
  if (!res.ok) throw new Error(await res.text());
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
    credentials: 'include',
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
