'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import type { Project } from '@/types/project';
import ProjectForm, { type ProjectFormValues } from './ProjectForm';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger la liste des projets au démarrage de la page
  useEffect(() => {
    api
      .get<Project[]>('/projects')
      .then(setProjects)
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : 'Impossible de charger les projets',
        ),
      )
      .finally(() => setLoading(false));
  }, []);

    // Créer un projet puis l'ajouter à la liste
  async function handleCreate(values: ProjectFormValues) {
    const created = await api.post<Project>('/projects', values);
    setProjects((previous) => [...previous, created]);
  }


  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-2xl font-bold">Projets</h1>
            <ProjectForm
        title="Nouveau projet"
        submitLabel="Créer"
        onSubmit={handleCreate}
      />

      {loading && <p>Chargement...</p>}

      {error && (
        <p className="mb-4 rounded bg-red-100 p-3 text-red-700">{error}</p>
      )}

      {!loading && !error && projects.length === 0 && (
        <p>Aucun projet pour le moment.</p>
      )}

      {projects.length > 0 && (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-800">
              <th className="p-3">ID</th>
              <th className="p-3">Nom</th>
              <th className="p-3">Description</th>
              <th className="p-3">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b">
                <td className="p-3">{project.id}</td>
                <td className="p-3 font-medium">{project.name}</td>
                <td className="p-3">{project.description ?? '-'}</td>
                <td className="p-3">
                  {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}