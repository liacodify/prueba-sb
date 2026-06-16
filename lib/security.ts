import type { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 60 * 1000;
const RATE_LIMIT_MAX = 100;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(request: Request): { success: boolean } {
	const ip =
		request.headers.get("x-forwarded-for")?.split(",")[0] ||
		request.headers.get("x-real-ip") ||
		"anonymous";

	const now = Date.now();
	const entry = rateLimitMap.get(ip);

	if (!entry || now > entry.resetAt) {
		rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
		return { success: true };
	}

	entry.count++;
	if (entry.count > RATE_LIMIT_MAX) {
		return { success: false };
	}

	return { success: true };
}

export function sanitizeString(str: unknown): string {
	if (typeof str !== "string") return "";
	return str
		.replace(/[<>]/g, "")
		.trim()
		.slice(0, 10000);
}

export function securityHeaders(response: NextResponse): NextResponse {
	response.headers.set("X-Content-Type-Options", "nosniff");
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-XSS-Protection", "1; mode=block");
	return response;
}

export function validateId(id: string): boolean {
	return /^[a-zA-Z0-9-_]+$/.test(id) && id.length <= 100;
}
