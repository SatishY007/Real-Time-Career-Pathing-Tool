/**
 * API Helper (Client)
 * -------------------
 * Centralized wrapper around `fetch()` used by the React UI to talk to the backend.
 *
 * Key idea:
 * - In development we call same-origin `/api/...` so Vite can proxy to the Express server.
 * - In production you can point the UI to a different backend origin via `VITE_API_BASE_URL`.
 *
 * This module also:
 * - Attaches the JWT token (if present) to requests.
 * - Converts non-2xx responses into user-friendly errors.
 * - Redirects to `/login` on 401 (expired/invalid session).
 */

const envBaseURL = import.meta?.env?.VITE_API_BASE_URL;
const baseURL = envBaseURL ?? (import.meta?.env?.DEV ? '' : 'http://localhost:5000');

/**
 * Returns Authorization headers if a token exists.
 * The server expects a `Bearer <token>` JWT in the `Authorization` header.
 */
function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}


/**
 * Performs a GET request against the backend API.
 * @param {string} path - API path, e.g. `/api/jobs/live?role=react`
 * @returns {Promise<any>} Parsed JSON response.
 */
export async function apiGet(path) {
  let res;
  try {
    res = await fetch(baseURL + path, {
      headers: {
        ...getAuthHeaders(),
      },
    });
  } catch (err) {
    // Network-level error (server down / DNS / CORS / proxy not running).
    throw new Error(
      `Cannot reach backend API. ` +
        `Start the server (root: npm run dev, or server: npm run dev:server) ` +
        `or set VITE_API_BASE_URL. (${err?.message || 'network error'})`
    );
  }
  if (!res.ok) {
    if (res.status === 401) {
      // If the token is invalid/expired, clear it and force the user to login again.
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location?.pathname !== '/login') {
        window.location.assign('/login');
      }
      throw new Error('Session expired. Please log in again.');
    }
    // Attempt to extract a helpful error message from the server response.
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


/**
 * Performs a POST request against the backend API.
 * @param {string} path - API path, e.g. `/api/auth/login`
 * @param {any} data - JSON-serializable payload
 * @returns {Promise<any>} Parsed JSON response.
 */
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
    // Network-level error (server down / DNS / CORS / proxy not running).
    throw new Error(
      `Cannot reach backend API. ` +
        `Start the server (root: npm run dev, or server: npm run dev:server) ` +
        `or set VITE_API_BASE_URL. (${err?.message || 'network error'})`
    );
  }
  if (!res.ok) {
    if (res.status === 401) {
      // If the token is invalid/expired, clear it and force the user to login again.
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location?.pathname !== '/login') {
        window.location.assign('/login');
      }
      throw new Error('Session expired. Please log in again.');
    }
    // Attempt to extract a helpful error message from the server response.
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
