import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { solicitudesApi } from "@/services/api-client";
import type {
	CreateSolicitudDTO,
	PatchSolicitudDTO,
	SolicitudFilters,
	Status,
	Priority,
	UpdateSolicitudDTO,
	Solicitud,
} from "@/types";

const statusLabels: Record<Status, string> = {
	pending: "Pendiente",
	in_review: "En Revisión",
	approved: "Aprobada",
	rejected: "Rechazada",
	closed: "Cerrada",
};

const priorityLabels: Record<Priority, string> = {
	low: "Baja",
	medium: "Media",
	high: "Alta",
	critical: "Crítica",
};

export const queryKeys = {
	solicitudes: {
		all: ["solicitudes"] as const,
		list: (filters?: SolicitudFilters, page?: number, pageSize?: number) =>
			["solicitudes", "list", filters, page, pageSize] as const,
		detail: (id: string) => ["solicitudes", "detail", id] as const,
		summary: ["solicitudes", "summary"] as const,
	},
};

export function useSolicitudes(
	filters?: SolicitudFilters,
	page: number = 1,
	pageSize: number = 100,
) {
	return useQuery({
		queryKey: queryKeys.solicitudes.list(filters, page, pageSize),
		queryFn: () => solicitudesApi.getAll(filters, page, pageSize),
		placeholderData: (previousData) => previousData,
	});
}

export function useSolicitud(id: string) {
	return useQuery({
		queryKey: queryKeys.solicitudes.detail(id),
		queryFn: () => solicitudesApi.getById(id),
		enabled: !!id,
	});
}

export function useSolicitudSummary() {
	return useQuery({
		queryKey: queryKeys.solicitudes.summary,
		queryFn: () => solicitudesApi.getSummary(),
	});
}

export function useCreateSolicitud() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateSolicitudDTO) => solicitudesApi.create(data),
		onMutate: async (newData) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.solicitudes.all });
			const previousData = queryClient.getQueryData(queryKeys.solicitudes.all);
			return { previousData };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.solicitudes.all });
			toast.success("Solicitud creada exitosamente");
		},
		onError: (_err, _data, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(queryKeys.solicitudes.all, context.previousData);
			}
			toast.error("Error al crear la solicitud");
		},
	});
}

export function usePatchSolicitud() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: PatchSolicitudDTO }) =>
			solicitudesApi.patch(id, data),
		onMutate: async ({ id, data }) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.solicitudes.all });
			const previousData = queryClient.getQueryData(queryKeys.solicitudes.all);

			queryClient.setQueryData(
				queryKeys.solicitudes.list(),
				(old: { data: Solicitud[] } | undefined) => {
					if (!old?.data) return old;
					return {
						...old,
						data: old.data.map((s) =>
							s.id === id ? { ...s, ...data } : s,
						),
					};
				},
			);

			return { previousData };
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.solicitudes.all });
			if (variables.data.status) {
				toast.success(`Estado cambiado a ${statusLabels[variables.data.status]}`);
			} else if (variables.data.priority) {
				toast.success(`Prioridad cambiada a ${priorityLabels[variables.data.priority]}`);
			} else {
				toast.success("Solicitud actualizada");
			}
		},
		onError: (_err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(queryKeys.solicitudes.all, context.previousData);
			}
			toast.error("Error al actualizar la solicitud");
		},
	});
}

export function useUpdateSolicitud() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateSolicitudDTO }) =>
			solicitudesApi.put(id, data),
		onMutate: async ({ id, data }) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.solicitudes.all });
			const previousData = queryClient.getQueryData(queryKeys.solicitudes.all);

			queryClient.setQueryData(
				queryKeys.solicitudes.list(),
				(old: { data: Solicitud[] } | undefined) => {
					if (!old?.data) return old;
					return {
						...old,
						data: old.data.map((s) =>
							s.id === id ? { ...s, ...data } : s,
						),
					};
				},
			);

			return { previousData };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.solicitudes.all });
			toast.success("Solicitud actualizada");
		},
		onError: (_err, _vars, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(queryKeys.solicitudes.all, context.previousData);
			}
			toast.error("Error al actualizar la solicitud");
		},
	});
}

export function useDeleteSolicitud() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => solicitudesApi.delete(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: queryKeys.solicitudes.all });
			const previousData = queryClient.getQueryData(queryKeys.solicitudes.all);

			queryClient.setQueryData(
				queryKeys.solicitudes.list(),
				(old: { data: Solicitud[] } | undefined) => {
					if (!old?.data) return old;
					return {
						...old,
						data: old.data.filter((s) => s.id !== id),
					};
				},
			);

			return { previousData };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: queryKeys.solicitudes.all });
			toast.success("Solicitud eliminada");
		},
		onError: (_err, _id, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(queryKeys.solicitudes.all, context.previousData);
			}
			toast.error("Error al eliminar la solicitud");
		},
	});
}
