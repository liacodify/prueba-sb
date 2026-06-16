"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "@/lib/use-translations";
import type { Priority } from "@/types";

interface PrioritySelectProps {
	value: Priority | undefined;
	onValueChange: (value: Priority) => void;
	placeholder?: string;
}

const priorities: Priority[] = ["low", "medium", "high", "critical"];

export function PrioritySelect({
	value,
	onValueChange,
	placeholder,
}: PrioritySelectProps) {
	const { t } = useTranslations();

	return (
		<Select
			value={value || ""}
			onValueChange={(val) => val && onValueChange(val as Priority)}
		>
			<SelectTrigger>
				<SelectValue
					placeholder={placeholder || t("solicitudes.form.selectPriority")}
				>
					{value ? t(`solicitudes.priorities.${value}`) : undefined}
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{priorities.map((p) => (
					<SelectItem key={p} value={p}>
						{t(`solicitudes.priorities.${p}`)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
