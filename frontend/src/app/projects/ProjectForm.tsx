'use client';

import { useState, type FormEvent } from 'react';
import { ApiError } from '@/lib/api';

export interface ProjectFormValues {
  name: string;
  description?: string;
}

interface ProjectFormProps {
  title: string;
  submitLabel: string;
  initialValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  onCancel?: () => void;
}

// Formulaire réutilisé pour la création et la modification d'un projet
export default function ProjectForm({
  title,
  submitLabel,
  initialValues,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(
    initialValues?.description ?? '',
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        // description vide → non envoyée
        description: description.trim() || undefined,
      });

      // Après une création, on vide le formulaire
      if (!initialValues) {
        setName('');
        setDescription('');
      }
    } catch (err) {
      setErrors(
        err instanceof ApiError ? err.messages : ['Une erreur est survenue'],
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 space-y-4 rounded border border-gray-600 p-4"
    >
      <h2 className="text-lg font-semibold">{title}</h2>

      {errors.length > 0 && (
        <ul className="rounded bg-red-100 p-3 text-red-700">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block">
          Nom *
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded border border-gray-400 bg-transparent p-2"
          placeholder="Ex. : Projet E-commerce Tunisie"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-gray-400 bg-transparent p-2"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? 'Enregistrement...' : submitLabel}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-gray-400 px-4 py-2"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}