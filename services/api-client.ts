import axios, {
	type AxiosError,
	type AxiosInstance,
	type InternalAxiosRequestConfig,
} from "axios";
import type {
	ApiError,
	ApiResponse,
	CreateSolicitudDTO,
	PaginatedResponse,
	PatchSolicitudDTO,
	Solicitud,
	SolicitudFilters,
	SolicitudSummary,
	UpdateSolicitudDTO,
} from "@/types";

export interface ApiClientConfig {
	baseURL?: string;
	timeout?: number;
	retries?: number;
	retryDelay?: (attempt: number) => number;
	signal?: AbortSignal;
}

const defaultRetryDelay = (attempt: number) =>
	Math.min(1000 * 2 ** attempt, 30000);

function createApiClient(config: ApiClientConfig = {}): AxiosInstance {
	const {
		baseURL = "/api/v1",
		timeout = 10000,
		retries = 3,
		retryDelay = defaultRetryDelay,
	} = config;

	const client: AxiosInstance = axios.create({
		baseURL,
		headers: {
			"Content-Type": "application/json",
		},
		timeout,
	});

	const shouldRetry = (
		error: AxiosError<ApiError>,
		attempt: number,
	): boolean => {
		if (attempt >= retries) return false;
		if (error.response?.status === 401 || error.response?.status === 403) {
			return false;
		}
		if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
			return true;
		}
		if (!error.response) {
			return true;
		}
		return error.response.status >= 500;
	};

	client.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			return config;
		},
		(error) => {
			return Promise.reject(error);
		},
	);

	client.interceptors.response.use(
		(response) => {
			return response;
		},
		async (error: AxiosError<ApiError>) => {
			const originalRequest = error.config;

			if (!originalRequest) {
				return Promise.reject(error);
			}

			const retryCount =
				(
					originalRequest as InternalAxiosRequestConfig & {
						_retryCount?: number;
					}
				)._retryCount || 0;

			if (shouldRetry(error, retryCount)) {
				(
					originalRequest as InternalAxiosRequestConfig & {
						_retryCount?: number;
					}
				)._retryCount = retryCount + 1;
				const delay = retryDelay(retryCount);

				await new Promise((resolve) => setTimeout(resolve, delay));

				return client(originalRequest);
			}

			if (error.response) {
				const message = error.response.data?.message || "Error del servidor";
				return Promise.reject(new Error(message));
			}
			if (error.request) {
				return Promise.reject(new Error("No se pudo conectar con el servidor"));
			}
			return Promise.reject(new Error("Error al realizar la solicitud"));
		},
	);

	return client;
}

export const apiClient = createApiClient({
	timeout: 10000,
	retries: 3,
});

export const solicitudesApi = {
	getAll: async (
		filters?: SolicitudFilters,
		page: number = 1,
		pageSize: number = 10,
	): Promise<PaginatedResponse<Solicitud>> => {
		const params = new URLSearchParams();
		if (filters?.search) params.append("search", filters.search);
		if (filters?.status) params.append("status", filters.status);
		if (filters?.priority) params.append("priority", filters.priority);
		if (filters?.category) params.append("category", filters.category);
		params.append("page", String(page));
		params.append("pageSize", String(pageSize));

		const { data } = await apiClient.get<
			ApiResponse<PaginatedResponse<Solicitud>>
		>(`/solicitudes?${params.toString()}`);
		return data.data;
	},

	getById: async (id: string): Promise<Solicitud> => {
		const { data } = await apiClient.get<ApiResponse<Solicitud>>(
			`/solicitudes/${id}`,
		);
		return data.data;
	},

	create: async (solicitud: CreateSolicitudDTO): Promise<Solicitud> => {
		const { data } = await apiClient.post<ApiResponse<Solicitud>>(
			"/solicitudes",
			solicitud,
		);
		return data.data;
	},

	patch: async (
		id: string,
		patchData: PatchSolicitudDTO,
	): Promise<Solicitud> => {
		const { data } = await apiClient.patch<ApiResponse<Solicitud>>(
			`/solicitudes/${id}`,
			patchData,
		);
		return data.data;
	},

	put: async (
		id: string,
		updateData: UpdateSolicitudDTO,
	): Promise<Solicitud> => {
		const { data } = await apiClient.put<ApiResponse<Solicitud>>(
			`/solicitudes/${id}`,
			updateData,
		);
		return data.data;
	},

	delete: async (id: string): Promise<void> => {
		await apiClient.delete(`/solicitudes/${id}`);
	},

	getSummary: async (): Promise<SolicitudSummary> => {
		const { data } = await apiClient.get<ApiResponse<SolicitudSummary>>(
			"/solicitudes?summary=true",
		);
		return data.data;
	},
};

export default apiClient;
