
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,
  type AuthUser,
} from '@/lib/api';

type AuthContextType = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setAuthToken] = useState<string | null>(null);
  const [user, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setAuthToken(getToken());
    setAuthUser(getUser());
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken);
    setUser(newUser);

    setAuthToken(newToken);
    setAuthUser(newUser);
  };

  const logout = () => {
    clearToken();
    clearUser();

    setAuthToken(null);
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
