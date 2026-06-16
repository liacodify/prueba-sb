"use client";

import { useState } from "react";
import { Plus, Search, Filter, X } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriorityFilterSelect } from "@/components/ui/priority-filter-select";
import { CategoryFilterSelect } from "@/components/ui/category-filter-select";
import { useFilters } from "@/hooks/useFilters";
import { useTranslations } from "@/lib/use-translations";
import type { Solicitud, Status } from "@/types";
import { KanbanCard } from "./KanbanCard";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanMobileView } from "./KanbanMobileView";
import { NewSolicitudModal } from "./NewSolicitudModal";
import { SolicitudModal } from "./SolicitudModal";

const STATUSES: Status[] = [
	"pending",
	"in_review",
	"approved",
	"rejected",
	"closed",
];

interface KanbanBoardProps {
	solicitudes: Solicitud[];
	onStatusChange: (id: string, status: Status) => void;
	onDelete: (id: string) => void;
	onCreate: () => void;
	isLoading?: boolean;
}

export function KanbanBoard({
	solicitudes,
	onStatusChange,
	onDelete,
	onCreate,
	isLoading,
}: KanbanBoardProps) {
	const { t } = useTranslations();
	const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
	const [isDetailOpen, setIsDetailOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<Status>("pending");
	const [showFilters, setShowFilters] = useState(false);

	const {
		searchQuery,
		setSearchQuery,
		priorityFilter,
		setPriorityFilter,
		categoryFilter,
		setCategoryFilter,
		filteredSolicitudes,
		hasActiveFilters,
		clearFilters,
		resultCount,
	} = useFilters({ solicitudes });

	const handleCardClick = (solicitud: Solicitud) => {
		setSelectedSolicitud(solicitud);
		setIsDetailOpen(true);
	};

	const getSolicitudesByStatus = (status: Status) => {
		return filteredSolicitudes.filter((s) => s.status === status);
	};

	return (
		<div className="flex flex-col h-full w-full min-h-0 overflow-hidden bg-background">
			<div className="flex items-center gap-2 px-4 py-2 shrink-0 bg-muted/30 border-b border-border/40">
				<div className="relative flex-1">
					<Search
						className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						aria-hidden="true"
					/>
					<Input
						type="search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder={t("solicitudes.filters.search")}
						className="pl-10 h-9 bg-background shadow-sm w-full"
					/>
				</div>

				<Button
					variant={showFilters ? "secondary" : "outline"}
					size="icon"
					onClick={() => setShowFilters(!showFilters)}
					className="h-9 w-9 shrink-0"
				>
					<Filter className="h-4 w-4" />
				</Button>

				<Button
					onClick={() => setIsCreateOpen(true)}
					className="gap-2 shadow-lg shadow-primary/25"
				>
					<Plus className="h-4 w-4" />
					<span className="hidden sm:inline">{t("solicitudes.new")}</span>
				</Button>
			</div>

			{showFilters && (
				<div className="flex gap-2 px-4 py-3 bg-muted/20 border-b border-border/40">
					<div className="flex-1">
						<PriorityFilterSelect
							value={priorityFilter}
							onValueChange={setPriorityFilter}
						/>
					</div>

					<div className="flex-1">
						<CategoryFilterSelect
							value={categoryFilter}
							onValueChange={setCategoryFilter}
						/>
					</div>

					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="icon"
							onClick={clearFilters}
							className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			)}

			{hasActiveFilters && (
				<div className="px-4 py-1.5 text-xs text-muted-foreground bg-muted/10 border-b border-border/40">
					{resultCount.filtered} de {resultCount.total} {t("solicitudes.filters.results")}
				</div>
			)}

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
							{columnSolicitudes.map((solicitud) => (
								<KanbanCard
									key={solicitud.id}
									solicitud={solicitud}
									onClick={() => handleCardClick(solicitud)}
									onStatusChange={(newStatus) =>
										onStatusChange(solicitud.id, newStatus)
									}
									isLoading={isLoading}
								/>
							))}
						</KanbanColumn>
					);
				})}
			</div>

			<div className="flex-1 min-h-0 lg:hidden px-4 pb-4">
				<KanbanMobileView
					solicitudes={filteredSolicitudes}
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onCardClick={handleCardClick}
					onStatusChange={onStatusChange}
					onCreateClick={() => setIsCreateOpen(true)}
					isLoading={isLoading}
				/>
			</div>

			<SolicitudModal
				open={isDetailOpen}
				onOpenChange={setIsDetailOpen}
				solicitud={selectedSolicitud}
				onDelete={(id) => {
					onDelete(id);
					setIsDetailOpen(false);
				}}
				onStatusChange={(solicitud) => {
					onStatusChange(solicitud.id, solicitud.status);
				}}
			/>

			<SolicitudModal
				open={isEditOpen}
				onOpenChange={setIsEditOpen}
				solicitud={selectedSolicitud}
				mode="edit"
			/>

			<NewSolicitudModal
				open={isCreateOpen}
				onOpenChange={setIsCreateOpen}
				onCreated={() => {
					onCreate();
					setIsCreateOpen(false);
				}}
			/>
		</div>
	);
}
