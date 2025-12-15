import { useAppStore } from '../store/appStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export interface ApiError {
  status: number;
  message: string;
}

async function request<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const state = useAppStore.getState();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (options.auth !== false && state.accessToken) {
    headers['Authorization'] = `Bearer ${state.accessToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = 'Request failed';
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch {
      // ignore
    }
    const error: ApiError = { status: res.status, message };
    throw error;
  }

  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, auth: boolean = true) => request<T>(path, { method: 'GET', auth }),
  post: <T>(path: string, body?: unknown, auth: boolean = true) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined, auth }),
  patch: <T>(path: string, body?: unknown, auth: boolean = true) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined, auth }),
  delete: <T>(path: string, auth: boolean = true) => request<T>(path, { method: 'DELETE', auth }),
};
