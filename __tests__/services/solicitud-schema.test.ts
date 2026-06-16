import {
	createSolicitudSchema,
	patchSolicitudSchema,
	updateSolicitudSchema,
} from "@/features/solicitudes/schemas/solicitud.schema";

describe("Esquemas de Solicitud", () => {
	describe("createSolicitudSchema", () => {
		it("valida una solicitud válida", () => {
			const validData = {
				title: "Solicitud de prueba",
				description: "Esta es una descripción válida de al menos 10 caracteres",
				requester: "Juan Pérez",
				category: "hardware" as const,
				priority: "high" as const,
			};
			const result = createSolicitudSchema.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("rechaza título con menos de 5 caracteres", () => {
			const invalidData = {
				title: "Abc",
				description: "Esta es una descripción válida",
				requester: "Juan Pérez",
				category: "hardware" as const,
				priority: "high" as const,
			};
			const result = createSolicitudSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("rechaza descripción con menos de 10 caracteres", () => {
			const invalidData = {
				title: "Solicitud de prueba",
				description: "Corta",
				requester: "Juan Pérez",
				category: "hardware" as const,
				priority: "high" as const,
			};
			const result = createSolicitudSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("rechaza categoría inválida", () => {
			const invalidData = {
				title: "Solicitud de prueba",
				description: "Esta es una descripción válida",
				requester: "Juan Pérez",
				category: "invalid" as
					| "hardware"
					| "software"
					| "network"
					| "access"
					| "other",
				priority: "high" as const,
			};
			const result = createSolicitudSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("rechaza prioridad inválida", () => {
			const invalidData = {
				title: "Solicitud de prueba",
				description: "Esta es una descripción válida",
				requester: "Juan Pérez",
				category: "hardware" as const,
				priority: "invalid" as "low" | "medium" | "high" | "critical",
			};
			const result = createSolicitudSchema.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});

	describe("updateSolicitudSchema", () => {
		it("permite actualizaciones parciales", () => {
			const partialData = {
				title: "Título actualizado",
			};
			const result = updateSolicitudSchema.safeParse(partialData);
			expect(result.success).toBe(true);
		});

		it("permite objeto vacío", () => {
			const result = updateSolicitudSchema.safeParse({});
			expect(result.success).toBe(true);
		});
	});

	describe("patchSolicitudSchema", () => {
		it("valida actualización de prioridad", () => {
			const result = patchSolicitudSchema.safeParse({ priority: "critical" });
			expect(result.success).toBe(true);
		});

		it("valida actualización de estado", () => {
			const result = patchSolicitudSchema.safeParse({ status: "approved" });
			expect(result.success).toBe(true);
		});

		it("rechaza estado inválido", () => {
			const result = patchSolicitudSchema.safeParse({
				status: "invalid" as
					| "pending"
					| "in_review"
					| "approved"
					| "rejected"
					| "closed",
			});
			expect(result.success).toBe(false);
		});
	});
});
