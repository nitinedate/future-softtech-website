// Small wrapper around fetch for the Express API. The session lives in an
// httpOnly cookie, so no token is ever stored in JavaScript.
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Cannot reach the sign-in service. Check your connection, or make sure the server is running.',
      0,
    );
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      data.error || 'The sign-in service returned an unexpected response. Try again shortly.',
      response.status,
    );
  }
  return data;
}

export const api = {
  me: () => request('/auth/me'),
  login: (email, password, remember) =>
    request('/auth/login', { method: 'POST', body: { email, password, remember } }),
  logout: () => request('/auth/logout', { method: 'POST' }),
};
