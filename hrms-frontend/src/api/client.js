/**
 * api/client.js
 * ─────────────
 * Base HTTP client.
 *
 * - Reads VITE_API_BASE_URL from env (empty string = use Vite proxy in dev)
 * - Wraps fetch with consistent error normalisation
 * - Every error thrown has shape: { message: string, status: number }
 */

const BASE = import.meta.env.VITE_API_BASE_URL ?? "";
const API  = `${BASE}/api/v1`;

/**
 * Normalise any fetch / server error into { message, status }.
 */
async function parseError(response) {
  let message = `Request failed (${response.status})`;
  try {
    const body = await response.json();
    message = body?.message || message;
  } catch {
    // body wasn't JSON — keep default message
  }
  const err = new Error(message);
  err.status = response.status;
  return err;
}

/**
 * Core request wrapper.
 * Returns the parsed `data` field from the standard envelope:
 *   { success, message, data }
 */
async function request(method, path, body = undefined) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API}${path}`, options);

  if (!response.ok) {
    throw await parseError(response);
  }

  const json = await response.json();
  return json.data;        // unwrap envelope — callers get plain data
}

// Convenience wrappers
export const get    = (path)        => request("GET",    path);
export const post   = (path, body)  => request("POST",   path, body);
export const del    = (path)        => request("DELETE", path);
