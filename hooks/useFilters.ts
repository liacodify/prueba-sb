"use client";

import { useMemo, useState, useCallback } from "react";
import type { Category, Priority, Solicitud } from "@/types";

interface UseFiltersOptions {
	solicitudes: Solicitud[];
}

interface UseFiltersReturn {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
	priorityFilter: Priority | undefined;
	setPriorityFilter: (priority: Priority | undefined) => void;
	categoryFilter: Category | undefined;
	setCategoryFilter: (category: Category | undefined) => void;
	filteredSolicitudes: Solicitud[];
	hasActiveFilters: boolean;
	clearFilters: () => void;
	resultCount: {
		filtered: number;
		total: number;
	};
}

export function useFilters({ solicitudes }: UseFiltersOptions): UseFiltersReturn {
	const [searchQuery, setSearchQuery] = useState("");
	const [priorityFilter, setPriorityFilter] = useState<Priority | undefined>();
	const [categoryFilter, setCategoryFilter] = useState<Category | undefined>();

	const filteredSolicitudes = useMemo(() => {
		return solicitudes.filter((s) => {
			const matchesSearch =
				!searchQuery ||
				s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				s.requester.toLowerCase().includes(searchQuery.toLowerCase()) ||
				s.description.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesPriority = !priorityFilter || s.priority === priorityFilter;
			const matchesCategory = !categoryFilter || s.category === categoryFilter;

			return matchesSearch && matchesPriority && matchesCategory;
		});
	}, [solicitudes, searchQuery, priorityFilter, categoryFilter]);

	const hasActiveFilters = !!(searchQuery || priorityFilter || categoryFilter);

	const clearFilters = useCallback(() => {
		setSearchQuery("");
		setPriorityFilter(undefined);
		setCategoryFilter(undefined);
	}, []);

	return {
		searchQuery,
		setSearchQuery,
		priorityFilter,
		setPriorityFilter,
		categoryFilter,
		setCategoryFilter,
		filteredSolicitudes,
		hasActiveFilters,
		clearFilters,
		resultCount: {
			filtered: filteredSolicitudes.length,
			total: solicitudes.length,
		},
	};
}
