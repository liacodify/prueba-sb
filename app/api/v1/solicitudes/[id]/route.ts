import { type NextRequest, NextResponse } from "next/server";
import {
	patchSolicitudSchema,
	updateSolicitudSchema,
} from "@/features/solicitudes/schemas/solicitud.schema";
import {
	rateLimit,
	sanitizeString,
	securityHeaders,
	validateId,
} from "@/lib/security";
import { solicitudStore } from "@/lib/store";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const rateLimitResult = rateLimit(request);
	if (!rateLimitResult.success) {
		return securityHeaders(
			NextResponse.json({ message: "Demasiadas solicitudes" }, { status: 429 }),
		);
	}

	const { id } = await params;

	if (!validateId(id)) {
		return securityHeaders(
			NextResponse.json({ message: "ID inválido" }, { status: 400 }),
		);
	}

	const solicitud = solicitudStore.getById(id);

	if (!solicitud) {
		return securityHeaders(
			NextResponse.json(
				{ message: "Solicitud no encontrada" },
				{ status: 404 },
			),
		);
	}

	return securityHeaders(NextResponse.json({ data: solicitud }));
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const rateLimitResult = rateLimit(request);
	if (!rateLimitResult.success) {
		return securityHeaders(
			NextResponse.json({ message: "Demasiadas solicitudes" }, { status: 429 }),
		);
	}

	try {
		const { id } = await params;

		if (!validateId(id)) {
			return securityHeaders(
				NextResponse.json({ message: "ID inválido" }, { status: 400 }),
			);
		}

		const contentLength = request.headers.get("content-length");
		if (contentLength && parseInt(contentLength, 10) > 100 * 1024) {
			return securityHeaders(
				NextResponse.json(
					{ message: "Payload demasiado grande" },
					{ status: 413 },
				),
			);
		}

		const body = await request.json();

		const sanitizedBody: Record<string, string> = {};
		if (body.title !== undefined) sanitizedBody.title = sanitizeString(body.title);
		if (body.description !== undefined) sanitizedBody.description = sanitizeString(body.description);
		if (body.requester !== undefined) sanitizedBody.requester = sanitizeString(body.requester);
		if (body.category !== undefined) sanitizedBody.category = sanitizeString(body.category);
		if (body.priority !== undefined) sanitizedBody.priority = sanitizeString(body.priority);
		if (body.status !== undefined) sanitizedBody.status = sanitizeString(body.status);

		const result = updateSolicitudSchema.safeParse(sanitizedBody);

		if (!result.success) {
			return securityHeaders(
				NextResponse.json(
					{ message: "Datos inválidos", errors: result.error.flatten() },
					{ status: 400 },
				),
			);
		}

		const updated = solicitudStore.update(id, result.data);

		if (!updated) {
			return securityHeaders(
				NextResponse.json(
					{ message: "Solicitud no encontrada" },
					{ status: 404 },
				),
			);
		}

		return securityHeaders(
			NextResponse.json({
				data: updated,
				message: "Solicitud actualizada exitosamente",
			}),
		);
	} catch {
		return securityHeaders(
			NextResponse.json(
				{ message: "Error al actualizar la solicitud" },
				{ status: 500 },
			),
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const rateLimitResult = rateLimit(request);
	if (!rateLimitResult.success) {
		return securityHeaders(
			NextResponse.json({ message: "Demasiadas solicitudes" }, { status: 429 }),
		);
	}

	try {
		const { id } = await params;

		if (!validateId(id)) {
			return securityHeaders(
				NextResponse.json({ message: "ID inválido" }, { status: 400 }),
			);
		}

		const body = await request.json();

		const sanitizedBody: Record<string, string> = {};
		if (body.title !== undefined) sanitizedBody.title = sanitizeString(body.title);
		if (body.description !== undefined) sanitizedBody.description = sanitizeString(body.description);
		if (body.requester !== undefined) sanitizedBody.requester = sanitizeString(body.requester);
		if (body.category !== undefined) sanitizedBody.category = sanitizeString(body.category);
		if (body.priority !== undefined) sanitizedBody.priority = sanitizeString(body.priority);
		if (body.status !== undefined) sanitizedBody.status = sanitizeString(body.status);

		const result = patchSolicitudSchema.safeParse(sanitizedBody);

		if (!result.success) {
			return securityHeaders(
				NextResponse.json(
					{ message: "Datos inválidos", errors: result.error.flatten() },
					{ status: 400 },
				),
			);
		}

		const updated = solicitudStore.patch(id, result.data);

		if (!updated) {
			return securityHeaders(
				NextResponse.json(
					{ message: "Solicitud no encontrada" },
					{ status: 404 },
				),
			);
		}

		return securityHeaders(
			NextResponse.json({
				data: updated,
				message: "Solicitud actualizada parcialmente",
			}),
		);
	} catch {
		return securityHeaders(
			NextResponse.json(
				{ message: "Error al actualizar la solicitud" },
				{ status: 500 },
			),
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const rateLimitResult = rateLimit(request);
	if (!rateLimitResult.success) {
		return securityHeaders(
			NextResponse.json({ message: "Demasiadas solicitudes" }, { status: 429 }),
		);
	}

	const { id } = await params;

	if (!validateId(id)) {
		return securityHeaders(
			NextResponse.json({ message: "ID inválido" }, { status: 400 }),
		);
	}

	const deleted = solicitudStore.delete(id);

	if (!deleted) {
		return securityHeaders(
			NextResponse.json(
				{ message: "Solicitud no encontrada" },
				{ status: 404 },
			),
		);
	}

	return securityHeaders(
		NextResponse.json({ message: "Solicitud eliminada exitosamente" }),
	);
}
