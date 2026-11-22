
'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import CanManage from '@/components/CanManage';
import { getTeams, getProjects, createTeam, deleteTeam } from '@/lib/api';
import type { Team, Project } from '@/lib/api';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setError('');

        const [teamsData, projectsData] = await Promise.all([
          getTeams(),
          getProjects(),
        ]);

        setTeams(teamsData);
        setProjects(projectsData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Impossible de charger les données.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim() || !selectedProject) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);

      await createTeam({
        name: teamName.trim(),
        projectId: Number(selectedProject),
      });

      const updatedTeams = await getTeams();
      setTeams(updatedTeams);

      setTeamName('');
      setSelectedProject('');
      setShowForm(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de créer l'équipe.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteTeam = async (id: number, name: string) => {
  const confirmed = window.confirm(
    `Voulez-vous vraiment supprimer l'équipe "${name}" ?`,
  );

  if (!confirmed) return;

  try {
    setError('');

    await deleteTeam(id);

    const updatedTeams = await getTeams();
    setTeams(updatedTeams);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Impossible de supprimer l'équipe.",
    );
  }
};
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Teams Management
          </h1>

          <p className="mt-2 text-slate-600">
            Gestion des équipes et de leurs projets.
          </p>

          <CanManage>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              {showForm ? 'Fermer le formulaire' : '+ Ajouter une équipe'}
            </button>
          </CanManage>

          {showForm && (
            <CanManage>
              <form
                onSubmit={handleCreateTeam}
                className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h2 className="mb-5 text-xl font-bold text-gray-900">
                  Ajouter une équipe
                </h2>

                <div className="mb-4">
                  <label
                    htmlFor="teamName"
                    className="mb-2 block text-sm font-bold text-gray-900"
                  >
                    Nom de l'équipe
                  </label>

                  <input
                    id="teamName"
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Exemple : Équipe Backend"
                    className="w-full rounded-lg border-2 border-gray-400 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:border-blue-600 focus:outline-none"
                    required
                  />
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="selectedProject"
                    className="mb-2 block text-sm font-bold text-gray-900"
                  >
                    Projet
                  </label>

                  <select
                    id="selectedProject"
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-400 bg-white px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none"
                    required
                  >
                    <option value="">Sélectionner un projet</option>

                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-lg bg-gray-200 px-5 py-3 font-medium text-gray-900 hover:bg-gray-300"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </CanManage>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-700">
              {error}
            </p>
          )}

          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-800">
              Liste des équipes
            </h2>

            {isLoading && (
              <p className="text-gray-700">Chargement des équipes...</p>
            )}

            {!isLoading && !error && teams.length === 0 && (
              <p className="text-gray-600">
                Aucune équipe disponible.
              </p>
            )}

            {!isLoading && teams.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-sm text-gray-700">
                      <th className="p-3">ID</th>
                      <th className="p-3">Nom</th>
                      <th className="p-3">Projet</th>
                        <CanManage>
                            <th className="p-3">Actions</th>
                        </CanManage>
                    </tr>
                  </thead>

                  <tbody>
                    {teams.map((team) => (
                      <tr key={team.id} className="border-b text-gray-900">
                        <td className="p-3">{team.id}</td>
                        <td className="p-3 font-semibold">{team.name}</td>
                        <td className="p-3">
                          {team.project?.name ?? `Projet ${team.projectId}`}
                        </td>
                        <CanManage>
                        <td className="p-3">
                            <button
                            type="button"
                            onClick={() => handleDeleteTeam(team.id, team.name)}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                            Supprimer
                            </button>
                        </td>
                        </CanManage>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
