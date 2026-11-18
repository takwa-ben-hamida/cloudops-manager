// Client API : toutes les requêtes du frontend vers le backend NestJS passent par ici

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
const TOKEN_KEY = 'cloudops_token';

// ---------- Gestion du token JWT ----------

export function getToken(): string | null {
  if (typeof window === 'undefined') return null; // côté serveur : pas de localStorage
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ---------- Erreur renvoyée par l'API ----------

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[],
  ) {
    super(messages.join(' / '));
  }
}

// ---------- Requête générique ----------

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  // Ajoute le token s'il existe : Authorization: Bearer <token>
  const token = getToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  // 401 : token absent, invalide ou expiré → retour à la page de connexion
  if (
    response.status === 401 &&
    typeof window !== 'undefined' &&
    !['/login', '/register'].includes(window.location.pathname)
  ) {
    clearToken();
    window.location.href = '/login';
  }

  if (!response.ok) {
    // NestJS renvoie { message: string | string[], error, statusCode }
    const body = await response.json().catch(() => null);
    const message = body?.message ?? 'Erreur inattendue';
    throw new ApiError(
      response.status,
      Array.isArray(message) ? message : [message],
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ---------- Méthodes utilisées dans les pages ----------

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};