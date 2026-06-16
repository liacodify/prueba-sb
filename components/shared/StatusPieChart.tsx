"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Solicitud, Status } from "@/types";
import { useTranslations } from "@/lib/use-translations";

const statusColors: Record<Status, string> = {
	pending: "#f59e0b",
	in_review: "#3b82f6",
	approved: "#10b981",
	rejected: "#ef4444",
	closed: "#64748b",
};

interface StatusPieChartProps {
	solicitudes: Solicitud[];
}

export function StatusPieChart({ solicitudes }: StatusPieChartProps) {
	const { t } = useTranslations();

	const statusLabels: Record<Status, string> = {
		pending: t("solicitudes.statuses.pending"),
		in_review: t("solicitudes.statuses.in_review"),
		approved: t("solicitudes.statuses.approved"),
		rejected: t("solicitudes.statuses.rejected"),
		closed: t("solicitudes.statuses.closed"),
	};

	const data = (["pending", "in_review", "approved", "rejected", "closed"] as Status[])
		.map((status) => ({
			name: statusLabels[status],
			value: solicitudes.filter((s) => s.status === status).length,
			color: statusColors[status],
		}))
		.filter((item) => item.value > 0);

	if (data.length === 0) {
		return (
			<div className="h-[200px] flex items-center justify-center text-muted-foreground">
				{t("common.noResults")}
			</div>
		);
	}

	return (
		<div className="h-[220px] w-full">
			<ResponsiveContainer width="100%" height="100%">
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="45%"
						innerRadius={45}
						outerRadius={75}
						paddingAngle={2}
						dataKey="value"
						label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
						labelLine={{ strokeDasharray: "3 3" }}
					>
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={entry.color}
								stroke="transparent"
							/>
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							backgroundColor: "var(--background)",
							border: "1px solid var(--border)",
							borderRadius: "8px",
							fontSize: "12px",
						}}
					/>
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
}
