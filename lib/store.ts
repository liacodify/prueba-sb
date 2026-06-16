import { faker } from "@faker-js/faker"
import type { Category, Priority, Solicitud, Status } from "@/types";

const categories: Category[] = ["hardware", "software", "network", "access", "other"];
const priorities: Priority[] = ["low", "medium", "high", "critical"];
const statuses: Status[] = ["pending", "in_review", "approved", "rejected", "closed"];

const initialData: Solicitud[] = (() => {
  const data: Solicitud[] = [];
  const baseDate = new Date("2026-01-01");

  faker.seed(12345);

  for (let i = 1; i <= 10; i++) {
    const creationDate = faker.date.between({
      from: baseDate.toISOString(),
      to: "2026-05-01",
    });
    const lastChangeDate = faker.date.between({
      from: creationDate.toISOString(),
      to: "2026-06-01",
    });

    data.push({
      id: String(i),
      title: faker.helpers.arrayElement([
        "Laptop para desarrollo",
        "Acceso a repositorio",
        "Licencia de software",
        "Configuración de VPN",
        "Upgrade de memoria RAM",
        "Cuenta de usuario",
        "Monitor externo",
        "Acceso a base de datos",
        "Configuración de firewall",
        "Instalación de software",
      ]),
      description: faker.helpers.arrayElement([
        "Se requiere para desarrollo de proyecto",
        "Necesario para el equipo de trabajo",
        "Urgente para cumplir con deadline",
        "Solicitud pendiente hace semanas",
        "Alta prioridad según el manager",
        "Para nueva incorporación",
        "Reemplazo de equipo dañado",
        "Upgrade necesario por rendimiento",
      ]),
      requester: faker.person.fullName(),
      category: faker.helpers.arrayElement(categories),
      priority: faker.helpers.arrayElement(priorities),
      status: faker.helpers.arrayElement(statuses),
      creationDate: creationDate.toISOString(),
      lastChangeDate: lastChangeDate.toISOString(),
    });
  }

  return data;
})();

class SolicitudStore {
  private solicitudes: Map<string, Solicitud>;

  constructor() {
    this.solicitudes = new Map();
    for (const s of initialData) {
      this.solicitudes.set(s.id, s);
    }
  }

  getAll(): Solicitud[] {
    return Array.from(this.solicitudes.values());
  }

  getById(id: string): Solicitud | undefined {
    return this.solicitudes.get(id);
  }

  create(data: Omit<Solicitud, "id" | "creationDate" | "lastChangeDate">): Solicitud {
    const now = new Date().toISOString();
    const id = String(this.solicitudes.size + 1);
    const solicitud: Solicitud = {
      ...data,
      id,
      creationDate: now,
      lastChangeDate: now,
    };
    this.solicitudes.set(id, solicitud);
    return solicitud;
  }

  update(
    id: string,
    data: Partial<Omit<Solicitud, "id" | "creationDate">>,
  ): Solicitud | null {
    const existing = this.solicitudes.get(id);
    if (!existing) return null;
    const updated: Solicitud = {
      ...existing,
      ...data,
      lastChangeDate: new Date().toISOString(),
    };
    this.solicitudes.set(id, updated);
    return updated;
  }

  patch(
    id: string,
    data: Partial<Pick<Solicitud, "priority" | "status">>,
  ): Solicitud | null {
    return this.update(id, data);
  }

  delete(id: string): boolean {
    return this.solicitudes.delete(id);
  }

  getSummary(): {
    total: number;
    pending: number;
    in_review: number;
    approved: number;
    rejected: number;
    closed: number;
  } {
    const all = this.getAll();
    return {
      total: all.length,
      pending: all.filter((s) => s.status === "pending").length,
      in_review: all.filter((s) => s.status === "in_review").length,
      approved: all.filter((s) => s.status === "approved").length,
      rejected: all.filter((s) => s.status === "rejected").length,
      closed: all.filter((s) => s.status === "closed").length,
    };
  }

  filter(
    filters?: {
      search?: string;
      status?: Status;
      priority?: Priority;
      category?: Category;
    },
    page: number = 1,
    pageSize: number = 10,
  ): {
    data: Solicitud[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    let filtered = this.getAll();

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchLower) ||
          s.description.toLowerCase().includes(searchLower) ||
          s.requester.toLowerCase().includes(searchLower),
      );
    }

    if (filters?.status) {
      filtered = filtered.filter((s) => s.status === filters.status);
    }

    if (filters?.priority) {
      filtered = filtered.filter((s) => s.priority === filters.priority);
    }

    if (filters?.category) {
      filtered = filtered.filter((s) => s.category === filters.category);
    }

    filtered.sort(
      (a, b) =>
        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(),
    );

    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);

    return { data, total, page, pageSize, totalPages };
  }
}

export const solicitudStore = new SolicitudStore();
