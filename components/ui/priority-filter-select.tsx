"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslations } from "@/lib/use-translations";
import type { Priority } from "@/types";

interface PriorityFilterSelectProps {
	value: Priority | undefined;
	onValueChange: (value: Priority | undefined) => void;
	placeholder?: string;
}

const priorities: Priority[] = ["low", "medium", "high", "critical"];

export function PriorityFilterSelect({
	value,
	onValueChange,
	placeholder,
}: PriorityFilterSelectProps) {
	const { t } = useTranslations();

	return (
		<div className="flex flex-col gap-1">
			<Label htmlFor="priority-filter" className="text-xs text-muted-foreground">
				{t("solicitudes.filters.priority")}
			</Label>
			<Select
				value={value || "all"}
				onValueChange={(v) =>
					onValueChange(v === "all" ? undefined : (v as Priority))
				}
			>
				<SelectTrigger id="priority-filter" className="w-[160px]">
					<SelectValue
						placeholder={placeholder || t("solicitudes.filters.priority")}
					>
						{value
							? t(`solicitudes.priorities.${value}`)
							: t("solicitudes.filters.all")}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">{t("solicitudes.filters.all")}</SelectItem>
					{priorities.map((p) => (
						<SelectItem key={p} value={p}>
							{t(`solicitudes.priorities.${p}`)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
