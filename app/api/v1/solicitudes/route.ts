import { type NextRequest, NextResponse } from "next/server";
import { createSolicitudSchema } from "@/features/solicitudes/schemas/solicitud.schema";
import { rateLimit, sanitizeString, securityHeaders } from "@/lib/security";
import { solicitudStore } from "@/lib/store";
import type { Category, Priority, Status } from "@/types";

export async function GET(request: NextRequest) {
	const rateLimitResult = rateLimit(request);
	if (!rateLimitResult.success) {
		return securityHeaders(
			NextResponse.json({ message: "Demasiadas solicitudes" }, { status: 429 }),
		);
	}

	const { searchParams } = new URL(request.url);
	const search = searchParams.get("search");
	const status = searchParams.get("status") as Status | null;
	const priority = searchParams.get("priority") as Priority | null;
	const category = searchParams.get("category") as Category | null;

	const isSummary = searchParams.get("summary") === "true";

	if (isSummary) {
		const summary = solicitudStore.getSummary();
		return securityHeaders(NextResponse.json({ data: summary }));
	}

	const hasFilters = search || status || priority || category;

	if (!hasFilters) {
		const all = solicitudStore.getAll();
		return securityHeaders(
			NextResponse.json({
				data: {
					data: all,
					total: all.length,
					page: 1,
					pageSize: all.length,
					totalPages: 1,
				},
			}),
		);
	}

	const filters: {
		search?: string;
		status?: Status;
		priority?: Priority;
		category?: Category;
	} = {};

	if (search) filters.search = sanitizeString(search);
	if (status) filters.status = status;
	if (priority) filters.priority = priority;
	if (category) filters.category = category;

	const result = solicitudStore.filter(filters, 1, 100);
	return securityHeaders(NextResponse.json({ data: result }));
}

export async function POST(request: NextRequest) {
	const rateLimitResult = rateLimit(request);
	if (!rateLimitResult.success) {
		return securityHeaders(
			NextResponse.json({ message: "Demasiadas solicitudes" }, { status: 429 }),
		);
	}

	try {
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

		const sanitizedBody = {
			title: sanitizeString(body.title),
			description: sanitizeString(body.description),
			requester: sanitizeString(body.requester),
			category: sanitizeString(body.category),
			priority: sanitizeString(body.priority),
		};

		const result = createSolicitudSchema.safeParse(sanitizedBody);

		if (!result.success) {
			return securityHeaders(
				NextResponse.json(
					{ message: "Datos inválidos", errors: result.error.flatten() },
					{ status: 400 },
				),
			);
		}

		const solicitud = solicitudStore.create({
			...result.data,
			status: "pending",
		});

		return securityHeaders(
			NextResponse.json(
				{ data: solicitud, message: "Solicitud creada exitosamente" },
				{ status: 201 },
			),
		);
	} catch {
		return securityHeaders(
			NextResponse.json(
				{ message: "Error al procesar la solicitud" },
				{ status: 500 },
			),
		);
	}
}
