"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/lib/use-translations";
import type { Category } from "@/types";

interface CategorySelectProps {
	value: Category | undefined;
	onValueChange: (value: Category) => void;
	placeholder?: string;
}

const categories: Category[] = [
	"hardware",
	"software",
	"network",
	"access",
	"other",
];

export function CategorySelect({
	value,
	onValueChange,
	placeholder,
}: CategorySelectProps) {
	const { t } = useTranslations();

	return (
		<Select
			value={value || ""}
			onValueChange={(val) => val && onValueChange(val as Category)}
		>
			<SelectTrigger>
				<SelectValue
					placeholder={placeholder || t("solicitudes.form.selectCategory")}
				>
					{value ? t(`solicitudes.categories.${value}`) : undefined}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{categories.map((cat) => (
					<SelectItem key={cat} value={cat}>
						{t(`solicitudes.categories.${cat}`)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
