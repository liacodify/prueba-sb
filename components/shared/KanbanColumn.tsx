"use client";

import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
	children: ReactNode;
	count: number;
	header: ReactNode;
}

export function KanbanColumn({
	children,
	count,
	header,
}: KanbanColumnProps) {
	return (
		<div className="flex flex-col shrink-0 w-full min-w-[280px] max-w-[320px] h-full">
			<div className="flex items-center justify-between mb-3 px-1 shrink-0">
				<div className="flex items-center gap-2">{header}</div>
				<span
					className={cn(
						"flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium",
						count === 0
							? "bg-muted text-muted-foreground"
							: "bg-primary text-primary-foreground",
					)}
				>
					{count}
				</span>
			</div>

			<div
				className={cn(
					"flex-1 rounded-lg bg-muted/50 p-2 overflow-y-auto",
					"transition-colors duration-200",
				)}
				style={{ maxHeight: "calc(100vh - 200px)" }}
			>
				<div className="space-y-2">
					{children}
					{count === 0 && (
						<div
							className="flex flex-col items-center justify-center h-24 gap-2 text-sm text-muted-foreground border-2 border-dashed border-muted rounded-lg"
							data-cy="empty-column"
						>
							<Inbox className="h-6 w-6 text-muted-foreground/50" />
							<span>Sin solicitudes</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
