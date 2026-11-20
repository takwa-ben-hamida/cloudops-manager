'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');

  const handleLogin = async () => {
  try {
    setError('');

    const response = await api.post<{
      access_token: string;
      user: {
        id: number;
        fullName: string;
        email: string;
        role: string;
      };
    }>('/auth/login', {
      email,
      password,
    });

    login(response.access_token, response.user);

    router.push('/');
  } catch {
    setError('Email ou mot de passe incorrect');
  }
};
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Connexion</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />
      <br />

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />
      <br />

      <button onClick={handleLogin}>
        Se connecter
      </button>

      {error && (
        <p style={{ color: 'red' }}>
          {error}
        </p>
      )}
    </div>
  );
}