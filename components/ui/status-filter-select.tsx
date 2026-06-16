"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/lib/use-translations";
import type { Status } from "@/types";

interface StatusFilterSelectProps {
	value: Status | undefined;
	onValueChange: (value: Status | undefined) => void;
	placeholder?: string;
}

const statuses: Status[] = [
	"pending",
	"in_review",
	"approved",
	"rejected",
	"closed",
];

export function StatusFilterSelect({
	value,
	onValueChange,
	placeholder,
}: StatusFilterSelectProps) {
	const { t } = useTranslations();

	return (
		<Select
			value={value || "all"}
			onValueChange={(v) =>
				onValueChange(v === "all" ? undefined : (v as Status))
			}
		>
			<SelectTrigger className="w-[160px]">
				<SelectValue
					placeholder={placeholder || t("solicitudes.filters.status")}
				>
					{value
						? t(`solicitudes.statuses.${value}`)
						: t("solicitudes.filters.all")}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">{t("solicitudes.filters.all")}</SelectItem>
				{statuses.map((s) => (
					<SelectItem key={s} value={s}>
						{t(`solicitudes.statuses.${s}`)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
