"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { useCreateSolicitud } from "@/features/solicitudes/hooks/use-solicitudes";
import type { CreateSolicitudFormData } from "@/features/solicitudes/schemas/solicitud.schema";
import { createSolicitudSchema } from "@/features/solicitudes/schemas/solicitud.schema";
import { useTranslations } from "@/lib/use-translations";

interface NewSolicitudModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onCreated?: () => void;
}

export function NewSolicitudModal({
	open,
	onOpenChange,
	onCreated,
}: NewSolicitudModalProps) {
	const { t } = useTranslations();
	const createMutation = useCreateSolicitud();

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

	const handleSubmit = async (data: CreateSolicitudFormData) => {
		try {
			await createMutation.mutateAsync(data);
			toast.success(t("solicitudes.messages.created"));
			form.reset();
			onOpenChange(false);
			onCreated?.();
		} catch {
			toast.error(t("solicitudes.messages.error"));
		}
	};

	return (
		<Modal
			open={open}
			onOpenChange={onOpenChange}
			title={t("solicitudes.newTitle")}
			size="lg"
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
					<FormField
						name="title"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("solicitudes.form.title")}</FormLabel>
								<FormControl>
									<Input
										placeholder={t("solicitudes.form.titlePlaceholder")}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="requester"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("solicitudes.form.requester")}</FormLabel>
								<FormControl>
									<Input
										placeholder={t("solicitudes.form.requesterPlaceholder")}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-4">
						<FormField
							name="category"
							control={form.control}
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
							name="priority"
							control={form.control}
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
						name="description"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("solicitudes.form.description")}</FormLabel>
								<FormControl>
									<Textarea
										placeholder={t("solicitudes.form.descriptionPlaceholder")}
										className="min-h-[100px]"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							{t("common.cancel")}
						</Button>
						<Button type="submit" disabled={createMutation.isPending}>
							{createMutation.isPending
								? t("common.loading")
								: t("solicitudes.create")}
						</Button>
					</div>
				</form>
			</Form>
		</Modal>
	);
}
