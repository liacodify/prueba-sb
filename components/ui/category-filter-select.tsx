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
import type { Category } from "@/types";

interface CategoryFilterSelectProps {
	value: Category | undefined;
	onValueChange: (value: Category | undefined) => void;
	placeholder?: string;
}

const categories: Category[] = [
	"hardware",
	"software",
	"network",
	"access",
	"other",
];

export function CategoryFilterSelect({
	value,
	onValueChange,
	placeholder,
}: CategoryFilterSelectProps) {
	const { t } = useTranslations();

	return (
		<div className="flex flex-col gap-1">
			<Label htmlFor="category-filter" className="text-xs text-muted-foreground">
				{t("solicitudes.filters.category")}
			</Label>
			<Select
				value={value || "all"}
				onValueChange={(v) =>
					onValueChange(v === "all" ? undefined : (v as Category))
				}
			>
				<SelectTrigger id="category-filter" className="w-[160px]">
					<SelectValue
						placeholder={placeholder || t("solicitudes.filters.category")}
					>
						{value
							? t(`solicitudes.categories.${value}`)
							: t("solicitudes.filters.all")}
					</SelectValue>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">{t("solicitudes.filters.all")}</SelectItem>
					{categories.map((c) => (
						<SelectItem key={c} value={c}>
							{t(`solicitudes.categories.${c}`)}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
