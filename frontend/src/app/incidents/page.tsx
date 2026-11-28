
'use client';

import { useEffect, useState, type FormEvent } from 'react';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Table from '@/components/Table';
import Loading from '@/components/Loading';

import {
  getIncidents,
  createIncident,
  type Incident,
} from '@/lib/api';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('OPEN');
  const [alertId, setAlertId] = useState('');

  const [error, setError] = useState('');

  const loadIncidents = async () => {
    try {
      setError('');
      const data = await getIncidents();
      setIncidents(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors du chargement des incidents',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError('');

      await createIncident({
        description,
        status,
        ...(alertId.trim() !== '' ? { alertId: Number(alertId) } : {}),
      });

      setDescription('');
      setStatus('OPEN');
      setAlertId('');
      setShowForm(false);

      await loadIncidents();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erreur lors de la création de l’incident',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Description',
      render: (incident: Incident) => incident.description,
    },
    {
      header: 'Statut',
      render: (incident: Incident) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            incident.status === 'RESOLVED'
              ? 'bg-green-100 text-green-700'
              : incident.status === 'IN_PROGRESS'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {incident.status}
        </span>
      ),
    },
    {
      header: 'Alerte associée',
      render: (incident: Incident) =>
        incident.alert?.message ?? (
          <span className="text-gray-400">Aucune alerte</span>
        ),
    },
    {
      header: 'Date de création',
      render: (incident: Incident) =>
        new Date(incident.createdAt).toLocaleString('fr-FR'),
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Incidents
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Consulter et gérer l'historique des incidents.
              </p>
            </div>

            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Fermer' : '+ Ajouter un incident'}
            </Button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total des incidents</p>
              <p className="mt-2 text-2xl font-bold text-blue-600">
                {incidents.length}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Incidents ouverts</p>
              <p className="mt-2 text-2xl font-bold text-yellow-600">
                {incidents.filter((i) => i.status === 'OPEN').length}
              </p>
            </div>
          </div>

          {showForm && (
            <form
              onSubmit={handleCreate}
              className="space-y-4 rounded-xl bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                Créer un incident
              </h2>

              <Input
                id="description"
                label="Description"
                value={description}
                onChange={setDescription}
                placeholder="Exemple : Serveur indisponible"
                required
              />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="status" className="font-medium text-gray-700">
                    Statut
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900"
                  >
                    <option value="OPEN">Ouvert</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="RESOLVED">Résolu</option>
                  </select>
                </div>

                <Input
                  id="alertId"
                  label="ID de l'alerte (facultatif)"
                  type="number"
                  value={alertId}
                  onChange={setAlertId}
                  placeholder="Exemple : 1"
                />
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Liste des incidents
              </h2>

              <Button
                variant="secondary"
                onClick={loadIncidents}
                disabled={isLoading}
              >
                Actualiser
              </Button>
            </div>

            {isLoading ? (
              <Loading message="Chargement des incidents..." />
            ) : (
              <Table
                columns={columns}
                data={incidents}
                getRowKey={(incident) => incident.id}
                emptyMessage="Aucun incident disponible."
              />
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
