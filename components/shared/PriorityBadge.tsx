"use client";

import { memo } from "react";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

const priorityConfig: Record<Priority, string> = {
	low: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
	medium: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
	high: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800",
	critical: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
};

interface PriorityBadgeProps {
	priority: Priority | undefined;
}

export const PriorityBadge = memo(function PriorityBadge({ priority }: PriorityBadgeProps) {
	const { t } = useTranslations();

	if (!priority) return null;

	const label = t(`solicitudes.priorities.${priority}`);

	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors",
				priorityConfig[priority] ?? priorityConfig.medium
			)}
			role="status"
			aria-label={`Prioridad: ${label}`}
		>
			{label}
		</span>
	);
});
