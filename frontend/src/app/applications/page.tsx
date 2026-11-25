
'use client';

import { useEffect, useState, type FormEvent } from 'react';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table from '@/components/Table';
import Loading from '@/components/Loading';

import {
  getApplications,
  createApplication,
  getServers,
  getEnvironments,
  type Application,
  type ApplicationStatus,
  type Server,
  type Environment,
} from '@/lib/api';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [serverId, setServerId] = useState('');
  const [environmentId, setEnvironmentId] = useState('');
  const [status, setStatus] = useState<ApplicationStatus>('STOPPED');

  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');

      const [applicationsData, serversData, environmentsData] =
        await Promise.all([
          getApplications(),
          getServers(),
          getEnvironments(),
        ]);

      setApplications(applicationsData);
      setServers(serversData);
      setEnvironments(environmentsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des données',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!serverId || !environmentId) {
      setError('Veuillez sélectionner un serveur et un environnement.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await createApplication({
        name,
        version,
        serverId: Number(serverId),
        environmentId: Number(environmentId),
        status,
      });

      setName('');
      setVersion('');
      setServerId('');
      setEnvironmentId('');
      setStatus('STOPPED');
      setShowForm(false);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la création de l’application',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Nom',
      render: (app: Application) => app.name,
    },
    {
      header: 'Version',
      render: (app: Application) => app.version,
    },
    {
      header: 'Serveur',
      render: (app: Application) => app.server?.name ?? `#${app.serverId}`,
    },
    {
      header: 'Environnement',
      render: (app: Application) =>
        app.environment?.name ?? `#${app.environmentId}`,
    },
    {
      header: 'Statut',
      render: (app: Application) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            app.status === 'RUNNING'
              ? 'bg-green-100 text-green-700'
              : app.status === 'ERROR'
                ? 'bg-red-100 text-red-700'
                : app.status === 'DEPLOYING'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
          }`}
        >
          {app.status}
        </span>
      ),
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Applications
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gestion des applications de la plateforme CloudOps.
              </p>
            </div>

            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Fermer' : '+ Nouvelle application'}
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {showForm && (
            <form
              onSubmit={handleCreate}
              className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Créer une application
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="application-name"
                  label="Nom de l'application"
                  value={name}
                  onChange={setName}
                  placeholder="CloudOps Dashboard"
                  required
                />

                <Input
                  id="application-version"
                  label="Version"
                  value={version}
                  onChange={setVersion}
                  placeholder="1.0.0"
                  required
                />

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="server"
                    className="font-medium text-gray-700"
                  >
                    Serveur
                  </label>

                  <select
                    id="server"
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    required
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                  >
                    <option value="">Sélectionner un serveur</option>
                    {servers.map((server) => (
                      <option key={server.id} value={server.id}>
                        {server.name} ({server.provider})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="environment"
                    className="font-medium text-gray-700"
                  >
                    Environnement
                  </label>

                  <select
                    id="environment"
                    value={environmentId}
                    onChange={(e) => setEnvironmentId(e.target.value)}
                    required
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                  >
                    <option value="">Sélectionner un environnement</option>
                    {environments.map((environment) => (
                      <option key={environment.id} value={environment.id}>
                        {environment.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="status"
                    className="font-medium text-gray-700"
                  >
                    Statut
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                      setStatus(e.target.value as ApplicationStatus)
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                  >
                    <option value="STOPPED">STOPPED</option>
                    <option value="RUNNING">RUNNING</option>
                    <option value="DEPLOYING">DEPLOYING</option>
                    <option value="ERROR">ERROR</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Création...' : 'Créer'}
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </form>
          )}

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Liste des applications
            </h2>

            {isLoading ? (
              <Loading message="Chargement des applications..." />
            ) : (
              <Table
                columns={columns}
                data={applications}
                getRowKey={(app) => app.id}
                emptyMessage="Aucune application disponible."
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
