"use client";

import { motion } from "framer-motion";
import {
	Clock,
	Search,
	CheckCircle,
	XCircle,
	Archive,
	Eye,
	DoorClosed,
	RotateCcw,
} from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Solicitud, Status } from "@/types";

const statusConfig: Record<Status, { icon: typeof Clock; color: string; bg: string }> = {
	pending: {
		icon: Clock,
		color: "text-amber-600 dark:text-amber-400",
		bg: "bg-amber-100 dark:bg-amber-900/40",
	},
	in_review: {
		icon: Search,
		color: "text-blue-600 dark:text-blue-400",
		bg: "bg-blue-100 dark:bg-blue-900/40",
	},
	approved: {
		icon: CheckCircle,
		color: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-100 dark:bg-emerald-900/40",
	},
	rejected: {
		icon: XCircle,
		color: "text-red-600 dark:text-red-400",
		bg: "bg-red-100 dark:bg-red-900/40",
	},
	closed: {
		icon: Archive,
		color: "text-slate-600 dark:text-slate-400",
		bg: "bg-slate-100 dark:bg-slate-800",
	},
};

interface KanbanCardProps {
	solicitud: Solicitud;
	onClick: () => void;
	onStatusChange: (newStatus: Status) => void;
	isLoading?: boolean;
}

export function KanbanCard({
	solicitud,
	onClick,
	onStatusChange,
	isLoading,
}: KanbanCardProps) {
	const { t } = useTranslations();
	const config = statusConfig[solicitud.status];
	const Icon = config.icon;

	const handleApprove = (e: React.MouseEvent) => {
		e.stopPropagation();
		onStatusChange("approved");
	};

	const handleReject = (e: React.MouseEvent) => {
		e.stopPropagation();
		onStatusChange("rejected");
	};

	const handleReview = (e: React.MouseEvent) => {
		e.stopPropagation();
		onStatusChange("in_review");
	};

	const handleClose = (e: React.MouseEvent) => {
		e.stopPropagation();
		onStatusChange("closed");
	};

	const handleReopen = (e: React.MouseEvent) => {
		e.stopPropagation();
		onStatusChange("in_review");
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.2 }}
		>
			<div
				onClick={onClick}
				data-cy="kanban-card"
				className={cn(
					"group relative p-3 rounded-lg border bg-card text-card-foreground cursor-pointer",
					"transition-all duration-200 hover:shadow-md hover:border-primary/30",
					"flex flex-col gap-2",
				)}
			>
				<div className="flex items-start justify-between gap-2">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1">
							<div className={cn("p-1.5 rounded-md", config.bg)}>
								<Icon className={cn("h-3.5 w-3.5", config.color)} />
							</div>
							<StatusBadge status={solicitud.status} />
						</div>
						<h3 className="font-medium text-sm truncate">{solicitud.title}</h3>
						<p className="text-xs text-muted-foreground truncate">
							{solicitud.requester}
						</p>
					</div>
					<PriorityBadge priority={solicitud.priority} />
				</div>

				<p className="text-xs text-muted-foreground line-clamp-2">
					{solicitud.description}
				</p>

				<div className="flex items-center justify-between pt-2 border-t border-border/50">
					<div className="flex gap-1 flex-wrap">
						{solicitud.status === "in_review" && (
							<>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleApprove}
									disabled={isLoading}
									className="h-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
								>
									<CheckCircle className="h-3.5 w-3.5 mr-1" />
									{t("solicitudes.actions.approve")}
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleReject}
									disabled={isLoading}
									className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/40"
								>
									<XCircle className="h-3.5 w-3.5 mr-1" />
									{t("solicitudes.actions.reject")}
								</Button>
							</>
						)}
						{solicitud.status === "pending" && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleReview}
								disabled={isLoading}
								className="h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40"
							>
								<Eye className="h-3.5 w-3.5 mr-1" />
								{t("solicitudes.actions.review")}
							</Button>
						)}
						{solicitud.status === "approved" && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClose}
								disabled={isLoading}
								className="h-7 text-slate-600 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/40"
							>
								<DoorClosed className="h-3.5 w-3.5 mr-1" />
								{t("solicitudes.actions.close")}
							</Button>
						)}
						{solicitud.status === "rejected" && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleReview}
								disabled={isLoading}
								className="h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40"
							>
								<Search className="h-3.5 w-3.5 mr-1" />
								{t("solicitudes.actions.toReview")}
							</Button>
						)}
						{solicitud.status === "closed" && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleReopen}
								disabled={isLoading}
								className="h-7 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40"
							>
								<RotateCcw className="h-3.5 w-3.5 mr-1" />
								{t("solicitudes.actions.reopen")}
							</Button>
						)}
					</div>
					<span className="text-xs text-muted-foreground">
						{new Date(solicitud.lastChangeDate).toLocaleDateString()}
					</span>
				</div>
			</div>
		</motion.div>
	);
}
