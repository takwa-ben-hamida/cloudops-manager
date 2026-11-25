
// Client API : toutes les requêtes vers NestJS passent par ici

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const TOKEN_KEY = 'cloudops_token';
const USER_KEY = 'cloudops_user';

// ---------- Type utilisateur ----------

export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};


// ---------- Types Teams et Projects ----------

export type Project = {
  id: number;
  name: string;
};

export type Team = {
  id: number;
  name: string;
  projectId: number;
  project: Project;
};

// ---------- Types Applications ----------

export type ApplicationStatus =
  | 'RUNNING'
  | 'STOPPED'
  | 'DEPLOYING'
  | 'ERROR';

export type Application = {
  id: number;
  name: string;
  version: string;
  status: ApplicationStatus;
  serverId: number;
  environmentId: number;
  server?: {
    id: number;
    name: string;
  };
  environment?: {
    id: number;
    name: string;
  };
};

export type CreateApplicationData = {
  name: string;
  version: string;
  serverId: number;
  environmentId: number;
  status?: ApplicationStatus;
};

// ---------- Gestion du token JWT ----------

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

// ---------- Gestion des informations utilisateur ----------

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;

  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_KEY);
}

// ---------- Erreur API ----------

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[],
  ) {
    super(messages.join(' / '));
  }
}

// ---------- Requête générique ----------

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const token = getToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (
    response.status === 401 &&
    typeof window !== 'undefined' &&
    !['/login', '/register'].includes(window.location.pathname)
  ) {
    clearToken();
    clearUser();
    window.location.href = '/login';
  }

  if (!response.ok) {
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

// ---------- Méthodes API ----------

export const api = {
  get: <T>(path: string) => request<T>(path),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) =>
    request<T>(path, { method: 'DELETE' }),
};

 
// ---------- API Teams et Projects ----------

export const getTeams = () => api.get<Team[]>('/teams');

export const createTeam = (data: {
  name: string;
  projectId: number;
}) => api.post<Team>('/teams', data);

export const deleteTeam = (id: number) =>
  api.delete<Team>(`/teams/${id}`);

export const getProjects = () => api.get<Project[]>('/projects');

// ---------- API Applications ----------

export const getApplications = () =>
  api.get<Application[]>('/applications');

export const createApplication = (data: CreateApplicationData) =>
  api.post<Application>('/applications', data);

export type ServerStatus =
  | 'RUNNING'
  | 'STOPPED'
  | 'MAINTENANCE'
  | 'ERROR';

export type Server = {
  id: number;
  name: string;
  provider: string;
  region: string;
  cpu: number;
  ram: number;
  storage: number;
  ipAddress: string;
  status: ServerStatus;
  projectId: number;
};

export type Environment = {
  id: number;
  name: string;
  projectId: number;
};

export const getServers = () =>
  api.get<Server[]>('/servers');

export const getEnvironments = () =>
  api.get<Environment[]>('/environments');
