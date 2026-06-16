"use client";

import { useTranslations } from "@/lib/use-translations";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";

interface KanbanFilterBarProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	showFilters: boolean;
	onToggleFilters: () => void;
	onClearFilters: () => void;
	hasActiveFilters: boolean;
	onCreateClick: () => void;
	resultCount?: { filtered: number; total: number };
	children: React.ReactNode;
}

export function KanbanFilterBar({
	searchQuery,
	onSearchChange,
	showFilters,
	onToggleFilters,
	onClearFilters,
	hasActiveFilters,
	onCreateClick,
	resultCount,
	children,
}: KanbanFilterBarProps) {
	const { t } = useTranslations();

	return (
		<>
			<div className="flex items-center gap-2 px-4 py-2 shrink-0 bg-muted/30 border-b border-border/40">
				<div className="relative flex-1">
					<Search
						className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
						aria-hidden="true"
					/>
					<Input
						type="search"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t("solicitudes.filters.search")}
						className="pl-10 h-9 bg-background shadow-sm w-full"
					/>
				</div>

				<Button
					variant={showFilters ? "secondary" : "outline"}
					size="icon"
					onClick={onToggleFilters}
					className="h-9 w-9 shrink-0"
					aria-label="Mostrar filtros"
				>
					<Filter className="h-4 w-4" />
				</Button>

				<Button
					onClick={onCreateClick}
					className="gap-2 shadow-lg shadow-primary/25"
				>
					<span className="hidden sm:inline">{t("solicitudes.new")}</span>
				</Button>
			</div>

			{showFilters && (
				<div className="flex flex-col gap-2 px-4 py-3 bg-muted/20 border-b border-border/40 sm:flex-row">
					{children}
					{hasActiveFilters && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onClearFilters}
							className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground self-start sm:self-auto"
							aria-label="Limpiar filtros"
						>
							<X className="h-4 w-4" />
						</Button>
					)}
				</div>
			)}

			{hasActiveFilters && resultCount && (
				<div className="px-4 py-1.5 text-xs text-muted-foreground bg-muted/10 border-b border-border/40">
					{resultCount.filtered} de {resultCount.total} {t("solicitudes.filters.results")}
				</div>
			)}
		</>
	);
}
