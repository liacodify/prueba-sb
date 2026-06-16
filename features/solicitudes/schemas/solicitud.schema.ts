import { z } from "zod";

export const prioritySchema = z.enum(["low", "medium", "high", "critical"]);
export const statusSchema = z.enum([
	"pending",
	"in_review",
	"approved",
	"rejected",
	"closed",
]);
export const categorySchema = z.enum([
	"hardware",
	"software",
	"network",
	"access",
	"other",
]);

export const createSolicitudSchema = z.object({
	title: z
		.string()
		.min(5, "El título debe tener al menos 5 caracteres")
		.max(100, "El título no puede exceder 100 caracteres"),
	description: z
		.string()
		.min(10, "La descripción debe tener al menos 10 caracteres")
		.max(1000, "La descripción no puede exceder 1000 caracteres"),
	requester: z
		.string()
		.min(3, "El nombre del solicitante debe tener al menos 3 caracteres")
		.max(50, "El nombre no puede exceder 50 caracteres"),
	category: categorySchema,
	priority: prioritySchema,
});

export const updateSolicitudSchema = z.object({
	title: z
		.string()
		.min(5, "El título debe tener al menos 5 caracteres")
		.max(100, "El título no puede exceder 100 caracteres")
		.optional(),
	description: z
		.string()
		.min(10, "La descripción debe tener al menos 10 caracteres")
		.max(1000, "La descripción no puede exceder 1000 caracteres")
		.optional(),
	requester: z
		.string()
		.min(3, "El nombre del solicitante debe tener al menos 3 caracteres")
		.max(50, "El nombre no puede exceder 50 caracteres")
		.optional(),
	category: categorySchema.optional(),
	priority: prioritySchema.optional(),
	status: statusSchema.optional(),
});

export const patchSolicitudSchema = z.object({
	title: z
		.string()
		.min(5, "El título debe tener al menos 5 caracteres")
		.max(100, "El título no puede exceder 100 caracteres")
		.optional(),
	description: z
		.string()
		.min(10, "La descripción debe tener al menos 10 caracteres")
		.max(1000, "La descripción no puede exceder 1000 caracteres")
		.optional(),
	requester: z
		.string()
		.min(3, "El nombre del solicitante debe tener al menos 3 caracteres")
		.max(50, "El nombre no puede exceder 50 caracteres")
		.optional(),
	category: categorySchema.optional(),
	priority: prioritySchema.optional(),
	status: statusSchema.optional(),
});

export type CreateSolicitudFormData = z.infer<typeof createSolicitudSchema>;
export type UpdateSolicitudFormData = z.infer<typeof updateSolicitudSchema>;
export type PatchSolicitudFormData = z.infer<typeof patchSolicitudSchema>;
