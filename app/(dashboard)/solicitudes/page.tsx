"use client";

import { useCallback, useEffect, useState } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { KanbanBoard } from "@/components/shared/KanbanBoard";
import {
	useDeleteSolicitud,
	usePatchSolicitud,
	useSolicitudes,
} from "@/features/solicitudes/hooks/use-solicitudes";
import type { Status } from "@/types";

export default function SolicitudesPage() {
	const [mounted, setMounted] = useState(false);
	const { data, isLoading, isError, refetch } = useSolicitudes();
	const patchMutation = usePatchSolicitud();
	const deleteMutation = useDeleteSolicitud();

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleStatusChange = useCallback(
		async (id: string, status: Status) => {
			patchMutation.mutate({ id, data: { status } });
		},
		[patchMutation],
	);

	const handleDelete = useCallback(
		async (id: string) => {
			deleteMutation.mutate(id);
		},
		[deleteMutation],
	);

	const handleCreate = useCallback(() => {}, []);

	if (!mounted) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="animate-pulse text-muted-foreground">Cargando...</div>
			</div>
		);
	}

	if (isError) {
		return <ErrorState onRetry={() => refetch()} />;
	}

	return (
		<div className="h-full min-h-0">
			<KanbanBoard
				solicitudes={data?.data || []}
				onStatusChange={handleStatusChange}
				onDelete={handleDelete}
				onCreate={handleCreate}
				isLoading={
					isLoading || patchMutation.isPending || deleteMutation.isPending
				}
			/>
		</div>
	);
}
