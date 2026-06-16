"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "@/lib/use-translations";

interface ErrorStateProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
	const { t } = useTranslations();
	const defaultTitle = t("common.error");
	const defaultMessage = t("solicitudes.messages.error");

	return (
		<Card>
			<CardContent className="flex flex-col items-center justify-center py-12 text-center">
				<div
					role="alert"
					aria-live="assertive"
					aria-atomic="true"
					className="rounded-full bg-red-100 p-4 dark:bg-red-900/30"
				>
					<AlertCircle className="h-12 w-12 text-red-500" aria-hidden="true" />
				</div>
				<h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
					{title ?? defaultTitle}
				</h3>
				<p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
					{message ?? defaultMessage}
				</p>
				{onRetry && (
					<Button onClick={onRetry} variant="outline" className="mt-4 gap-2">
						<RefreshCw className="h-4 w-4" aria-hidden="true" />
						{t("common.retry")}
					</Button>
				)}
			</CardContent>
		</Card>
	);
}
