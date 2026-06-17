"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowRight, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { CategorySelect } from "@/components/ui/category-select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { PrioritySelect } from "@/components/ui/priority-select";
import { Textarea } from "@/components/ui/textarea";
import {
	useDeleteSolicitud,
	usePatchSolicitud,
	useUpdateSolicitud,
} from "@/features/solicitudes/hooks/use-solicitudes";
import type { CreateSolicitudFormData } from "@/features/solicitudes/schemas/solicitud.schema";
import { createSolicitudSchema } from "@/features/solicitudes/schemas/solicitud.schema";
import { useTranslations } from "@/lib/use-translations";
import type { Priority, Solicitud, Status } from "@/types";

interface SolicitudModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	solicitud: Solicitud | null;
	mode?: "view" | "edit";
	onDelete?: (id: string) => void;
	onStatusChange?: (solicitud: Solicitud) => void;
}

const NEXT_STATUSES: Record<Status, Status[]> = {
	pending: ["in_review"],
	in_review: ["approved", "rejected"],
	approved: ["closed"],
	rejected: ["in_review"],
	closed: ["in_review"],
};

const statusLabels: Record<Status, string> = {
	pending: "Pendiente",
	in_review: "En Revisión",
	approved: "Aprobada",
	rejected: "Rechazada",
	closed: "Cerrada",
};

const priorityLabels: Record<Priority, string> = {
	low: "Baja",
	medium: "Media",
	high: "Alta",
	critical: "Crítica",
};

export function SolicitudModal({
	open,
	onOpenChange,
	solicitud,
	mode = "view",
	onDelete,
	onStatusChange,
}: SolicitudModalProps) {
	const { t } = useTranslations();
	const patchMutation = usePatchSolicitud();
	const updateMutation = useUpdateSolicitud();
	const deleteMutation = useDeleteSolicitud();
	const [isEditing, setIsEditing] = useState(mode === "edit");
	const [currentSolicitud, setCurrentSolicitud] = useState<Solicitud | null>(
		solicitud,
	);

	useEffect(() => {
		setCurrentSolicitud(solicitud);
	}, [solicitud]);

	const form = useForm<CreateSolicitudFormData>({
		resolver: zodResolver(createSolicitudSchema),
		defaultValues: {
			title: "",
			description: "",
			requester: "",
			category: undefined,
			priority: undefined,
		},
	});

	useEffect(() => {
		if (currentSolicitud) {
			form.reset({
				title: currentSolicitud.title,
				description: currentSolicitud.description,
				requester: currentSolicitud.requester,
				category: currentSolicitud.category,
				priority: currentSolicitud.priority,
			});
		}
	}, [currentSolicitud, form]);

	const handleStatusChange = async (newStatus: Status) => {
		if (!currentSolicitud) return;
		try {
			const updated = await patchMutation.mutateAsync({
				id: currentSolicitud.id,
				data: { status: newStatus },
			});
			toast.success(`Estado cambiado a ${statusLabels[newStatus]}`);
			setCurrentSolicitud(updated);
			onStatusChange?.(updated);
			onOpenChange(false);
		} catch {
			toast.error("Error al cambiar estado");
		}
	};

	const handleDelete = async () => {
		if (!currentSolicitud) return;
		try {
			await deleteMutation.mutateAsync(currentSolicitud.id);
			toast.success("Solicitud eliminada");
			onOpenChange(false);
		} catch {
			toast.error("Error al eliminar");
		}
	};

	const handleNextStatus = async (status: Status) => {
		if (!currentSolicitud) return;
		await handleStatusChange(status);
	};

	const handleSubmit = async (data: CreateSolicitudFormData) => {
		if (!currentSolicitud) return;
		try {
			const updated = await updateMutation.mutateAsync({
				id: currentSolicitud.id,
				data,
			});
			toast.success("Solicitud actualizada");
			setCurrentSolicitud(updated);
			setIsEditing(false);
			onOpenChange(false);
		} catch {
			toast.error("Error al actualizar");
		}
	};

	const getActionLabel = (status: Status): string => {
		const labels: Record<Status, string> = {
			pending: t("solicitudes.actions.review"),
			in_review: t("solicitudes.actions.toReview"),
			approved: t("solicitudes.actions.approve"),
			rejected: t("solicitudes.actions.reject"),
			closed: t("solicitudes.actions.reopen"),
		};
		return labels[status];
	};

	if (mode === "edit" || isEditing) {
		return (
			<Modal
				open={open}
				onOpenChange={onOpenChange}
				title={t("solicitudes.editTitle")}
				size="lg"
			>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-4"
					>
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("solicitudes.form.title")}</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="requester"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("solicitudes.form.requester")}</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("solicitudes.form.category")}</FormLabel>
										<FormControl>
											<CategorySelect
												value={field.value}
												onValueChange={field.onChange}
												placeholder={t("solicitudes.form.selectCategory")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t("solicitudes.form.priority")}</FormLabel>
										<FormControl>
											<PrioritySelect
												value={field.value}
												onValueChange={field.onChange}
												placeholder={t("solicitudes.form.selectPriority")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("solicitudes.form.description")}</FormLabel>
									<FormControl>
										<Textarea {...field} className="min-h-[100px]" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									if (mode === "edit") {
										onOpenChange(false);
									} else {
										setIsEditing(false);
									}
								}}
							>
								{t("common.cancel")}
							</Button>
							<Button type="submit" disabled={updateMutation.isPending}>
								{updateMutation.isPending
									? t("common.loading")
									: t("common.save")}
							</Button>
						</div>
					</form>
				</Form>
			</Modal>
		);
	}

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			title={solicitud?.title}
			size="lg"
		>
			{solicitud && (
				<div className="space-y-6">
					<div className="flex items-center gap-2">
						<StatusBadge status={solicitud.status} />
						<PriorityBadge priority={solicitud.priority} />
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								{t("solicitudes.form.requester")}
							</p>
							<p>{solicitud.requester}</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								{t("solicitudes.form.category")}
							</p>
							<p className="capitalize">
								{t(`solicitudes.categories.${solicitud.category}`)}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Fecha de creación
							</p>
							<p>
								{format(
									new Date(solicitud.creationDate),
									"dd 'de' MMMM 'de' yyyy, HH:mm",
									{ locale: es },
								)}
							</p>
						</div>
						<div>
							<p className="text-sm font-medium text-muted-foreground">
								Última actualización
							</p>
							<p>
								{format(
									new Date(solicitud.lastChangeDate),
									"dd 'de' MMMM 'de' yyyy, HH:mm",
									{ locale: es },
								)}
							</p>
						</div>
					</div>

					<div>
						<p className="text-sm font-medium text-muted-foreground mb-1">
							{t("solicitudes.form.description")}
						</p>
						<p className="whitespace-pre-wrap">{solicitud.description}</p>
					</div>

					<div className="flex flex-wrap items-center gap-2 pt-4 border-t">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsEditing(true)}
						>
							<Pencil className="h-4 w-4 mr-2" />
							{t("solicitudes.actions.edit")}
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={handleDelete}
							disabled={deleteMutation.isPending}
							className="text-destructive hover:text-destructive"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							{t("solicitudes.actions.delete")}
						</Button>
						<div className="flex-1" />
						{NEXT_STATUSES[solicitud.status].map((status) => (
							<Button
								key={status}
								size="sm"
								onClick={() => handleNextStatus(status)}
								disabled={patchMutation.isPending}
							>
								{status === "closed" ? (
									<RotateCcw className="h-4 w-4 mr-2" />
								) : (
									<ArrowRight className="h-4 w-4 mr-2" />
								)}
								{getActionLabel(status)}
							</Button>
						))}
					</div>
				</div>
			)}
		</Modal>
	);
}