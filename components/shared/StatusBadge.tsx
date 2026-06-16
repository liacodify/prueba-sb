"use client";

import { memo } from "react";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";
import type { Status } from "@/types";

const statusConfig: Record<Status, { bg: string; text: string }> = {
	pending: {
		bg: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
		text: "amber",
	},
	in_review: {
		bg: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
		text: "blue",
	},
	approved: {
		bg: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
		text: "emerald",
	},
	rejected: {
		bg: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800",
		text: "rose",
	},
	closed: {
		bg: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
		text: "slate",
	},
};

interface StatusBadgeProps {
	status: Status;
}

export const StatusBadge = memo(function StatusBadge({ status }: StatusBadgeProps) {
	const { t } = useTranslations();
	const config = statusConfig[status] ?? statusConfig.pending;
	const label = t(`solicitudes.statuses.${status}`);

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors",
				config.bg
			)}
			role="status"
			aria-label={`Estado: ${label}`}
		>
			{label}
		</span>
	);
});
