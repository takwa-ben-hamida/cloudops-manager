
'use client';

import MetricsChart from '@/components/monitoring/MetricsChart';
import { useEffect, useState, type FormEvent } from 'react';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table from '@/components/Table';
import Loading from '@/components/Loading';
import {
  getMetrics,
  createMetric,
  getServers,
  type Metric,
  type Server,
} from '@/lib/api';

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [servers, setServers] = useState<Server[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [cpuUsage, setCpuUsage] = useState('');
  const [ramUsage, setRamUsage] = useState('');
  const [serverId, setServerId] = useState('');
  const [available, setAvailable] = useState('true');

  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');

      const [metricsData, serversData] = await Promise.all([
        getMetrics(),
        getServers(),
      ]);

      setMetrics(metricsData);
      setServers(serversData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des métriques',
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

    if (!serverId) {
      setError('Veuillez sélectionner un serveur.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      await createMetric({
        cpuUsage: Number(cpuUsage),
        ramUsage: Number(ramUsage),
        serverId: Number(serverId),
        available: available === 'true',
      });

      setCpuUsage('');
      setRamUsage('');
      setServerId('');
      setAvailable('true');
      setShowForm(false);

      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de l’ajout de la métrique',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Serveur',
      render: (metric: Metric) =>
        metric.server?.name ?? `#${metric.serverId}`,
    },
    {
      header: 'CPU',
      render: (metric: Metric) => `${metric.cpuUsage}%`,
    },
    {
      header: 'RAM',
      render: (metric: Metric) => `${metric.ramUsage}%`,
    },
    {
      header: 'Disponibilité',
      render: (metric: Metric) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            metric.available
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {metric.available ? 'Disponible' : 'Indisponible'}
        </span>
      ),
    },
    {
      header: 'Date',
      render: (metric: Metric) =>
        new Date(metric.recordedAt).toLocaleString('fr-FR'),
    },
  ];

  const averageCPU = metrics.length
    ? metrics.reduce((sum, metric) => sum + metric.cpuUsage, 0) / metrics.length
    : 0;

  const averageRAM = metrics.length
    ? metrics.reduce((sum, metric) => sum + metric.ramUsage, 0) / metrics.length
    : 0;

  const availableCount = metrics.filter((metric) => metric.available).length;
  const unavailableCount = metrics.filter((metric) => !metric.available).length;
 
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Monitoring
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Suivi des métriques CPU, RAM et disponibilité des serveurs.
              </p>
            </div>

            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Fermer' : '+ Ajouter une métrique'}
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">CPU moyen</p>
            <p className="mt-2 text-2xl font-bold text-blue-600">
            {averageCPU.toFixed(1)}%
            </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">RAM moyenne</p>
            <p className="mt-2 text-2xl font-bold text-purple-600">
            {averageRAM.toFixed(1)}%
            </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Métriques disponibles</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
            {availableCount}
            </p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Métriques indisponibles</p>
            <p className="mt-2 text-2xl font-bold text-red-600">
            {unavailableCount}
            </p>
        </div>
        {/* les 4 cartes statistiques */}
        </div>

        <MetricsChart metrics={metrics} />
        
          {showForm && (
            // formulaire
            <form
              onSubmit={handleCreate}
              className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Ajouter une métrique
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  id="cpuUsage"
                  label="Utilisation CPU (%)"
                  type="number"
                  value={cpuUsage}
                  onChange={setCpuUsage}
                  placeholder="45"
                  required
                />

                <Input
                  id="ramUsage"
                  label="Utilisation RAM (%)"
                  type="number"
                  value={ramUsage}
                  onChange={setRamUsage}
                  placeholder="60"
                  required
                />

                <div className="flex flex-col gap-2">
                  <label htmlFor="serverId" className="font-medium text-gray-700">
                    Serveur
                  </label>

                  <select
                    id="serverId"
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    required
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                  >
                    <option value="">Sélectionner un serveur</option>
                    {servers.map((server) => (
                      <option key={server.id} value={server.id}>
                        {server.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="available" className="font-medium text-gray-700">
                    Disponibilité
                  </label>

                  <select
                    id="available"
                    value={available}
                    onChange={(e) => setAvailable(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                  >
                    <option value="true">Disponible</option>
                    <option value="false">Indisponible</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Ajout...' : 'Ajouter'}
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
              Liste des métriques
            </h2>

            {isLoading ? (
              <Loading message="Chargement des métriques..." />
            ) : (
              <Table
                columns={columns}
                data={metrics}
                getRowKey={(metric) => metric.id}
                emptyMessage="Aucune métrique disponible."
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
