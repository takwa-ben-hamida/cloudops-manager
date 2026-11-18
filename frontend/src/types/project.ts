// Projet tel que renvoyé par l'API NestJS (GET /projects)
export interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}