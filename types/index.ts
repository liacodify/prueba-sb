export type Priority = "low" | "medium" | "high" | "critical";
export type Status =
	| "pending"
	| "in_review"
	| "approved"
	| "rejected"
	| "closed";
export type Category = "hardware" | "software" | "network" | "access" | "other";

export interface Solicitud {
	id: string;
	title: string;
	description: string;
	requester: string;
	category: Category;
	priority: Priority;
	status: Status;
	creationDate: string;
	lastChangeDate: string;
}

export interface SolicitudSummary {
	total: number;
	pending: number;
	in_review: number;
	approved: number;
	rejected: number;
	closed: number;
}

export interface CreateSolicitudDTO {
	title: string;
	description: string;
	requester: string;
	category: Category;
	priority: Priority;
}

export interface UpdateSolicitudDTO {
	title?: string;
	description?: string;
	requester?: string;
	category?: Category;
	priority?: Priority;
	status?: Status;
}

export interface UpdateSolicitudDTO {
	title?: string;
	description?: string;
	requester?: string;
	category?: Category;
	priority?: Priority;
	status?: Status;
}

export interface PatchSolicitudDTO {
	priority?: Priority;
	status?: Status;
}

export interface ApiResponse<T> {
	data: T;
	message?: string;
}

export interface ApiError {
	message: string;
	code?: string;
	status?: number;
}

export interface PaginatedResponse<T> {
	data: T[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface SolicitudFilters {
	search?: string;
	status?: Status;
	priority?: Priority;
	category?: Category;
}

export type SortOrder = "asc" | "desc";

export interface SolicitudSort {
	field: keyof Solicitud;
	order: SortOrder;
}
