"use client";

import { AnimatePresence, motion } from "framer-motion";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { KanbanCard } from "@/components/shared/KanbanCard";
import { KanbanColumn } from "@/components/shared/KanbanColumn";
import type { Solicitud, Status } from "@/types";

const STATUSES: Status[] = [
	"pending",
	"in_review",
	"approved",
	"rejected",
	"closed",
];

interface KanbanDesktopViewProps {
	solicitudes: Solicitud[];
	onCardClick: (solicitud: Solicitud) => void;
	onStatusChange: (id: string, status: Status) => void;
	isLoading?: boolean;
}

export function KanbanDesktopView({
	solicitudes,
	onCardClick,
	onStatusChange,
	isLoading,
}: KanbanDesktopViewProps) {
	const getSolicitudesByStatus = (status: Status) => {
		return solicitudes.filter((s) => s.status === status);
	};

	return (
		<div className="hidden lg:flex gap-4 flex-1 overflow-x-auto px-4">
			{STATUSES.map((status) => {
				const columnSolicitudes = getSolicitudesByStatus(status);
				const isEmpty = columnSolicitudes.length === 0;

				return (
					<KanbanColumn
						key={status}
						count={columnSolicitudes.length}
						header={<StatusBadge status={status} />}
					>
						<AnimatePresence mode="popLayout">
							{columnSolicitudes.map((solicitud) => (
								<motion.div
									key={solicitud.id}
									layout
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ duration: 0.2 }}
								>
									<KanbanCard
										solicitud={solicitud}
										onClick={() => onCardClick(solicitud)}
										onStatusChange={(newStatus) =>
											onStatusChange(solicitud.id, newStatus)
										}
										isLoading={isLoading}
									/>
								</motion.div>
							))}
						</AnimatePresence>
					</KanbanColumn>
				);
			})}
		</div>
	);
}
