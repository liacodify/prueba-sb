"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/use-translations";

interface DeleteConfirmationDialogProps {
	onConfirm: () => void;
	isPending?: boolean;
}

export function DeleteConfirmationDialog({
	onConfirm,
	isPending,
}: DeleteConfirmationDialogProps) {
	const { t } = useTranslations();
	const [open, setOpen] = useState(false);
	const cancelRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (open) {
			const timer = setTimeout(() => {
				cancelRef.current?.focus();
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [open]);

	const handleConfirm = () => {
		onConfirm();
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger
				render={
					<Button
						variant="destructive"
						disabled={isPending}
						className="focus-visible:ring-2 focus-visible:ring-red-500"
					>
						<Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
						{isPending ? t("common.loading") : t("common.delete")}
					</Button>
				}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle id="delete-dialog-title">
						{t("solicitudes.deleteConfirm.title")}
					</AlertDialogTitle>
					<AlertDialogDescription id="delete-dialog-description">
						{t("solicitudes.deleteConfirm.description")}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel ref={cancelRef}>
						{t("common.cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-2 focus-visible:ring-red-500"
					>
						{t("common.delete")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
