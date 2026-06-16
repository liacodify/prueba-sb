"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PrioritySelect } from "@/components/ui/priority-select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/lib/use-translations";
import { useCreateSolicitud } from "../hooks/use-solicitudes";
import {
	type CreateSolicitudFormData,
	createSolicitudSchema,
} from "../schemas/solicitud.schema";

export function SolicitudForm() {
	const { t } = useTranslations();
	const router = useRouter();
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

	const onSubmit = async (data: CreateSolicitudFormData) => {
		try {
			await createMutation.mutateAsync(data);
			toast.success(t("solicitudes.messages.created"));
			router.push("/solicitudes");
		} catch {
			toast.error(t("solicitudes.messages.error"));
		}
	};

	return (
		<div className="mx-auto max-w-2xl">
			<div className="mb-6">
				<Link
					href="/solicitudes"
					className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
				>
					<ArrowLeft className="h-4 w-4" />
					{t("common.back")}
				</Link>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>{t("solicitudes.newTitle")}</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
							<FormField
								control={form.control}
								name="title"
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
								control={form.control}
								name="requester"
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

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
											<Textarea
												placeholder={t(
													"solicitudes.form.descriptionPlaceholder",
												)}
												className="min-h-[120px]"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex flex-col sm:flex-row gap-4">
								<Button type="submit" disabled={createMutation.isPending}>
									{createMutation.isPending
										? t("common.loading")
										: t("solicitudes.create")}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
								>
									{t("common.cancel")}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
