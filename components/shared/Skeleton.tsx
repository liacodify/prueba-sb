"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
	className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
	return (
		<div
			className={cn(
				"animate-pulse rounded-md bg-muted",
				className,
			)}
		/>
	);
}

export function SkeletonCard() {
	return (
		<div className="p-3 space-y-3 border border-border rounded-lg bg-card">
			<div className="flex items-start justify-between gap-2">
				<div className="space-y-2 flex-1">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
				</div>
				<Skeleton className="h-5 w-16 rounded-full" />
			</div>
			<Skeleton className="h-3 w-full" />
			<div className="flex items-center justify-between pt-2">
				<div className="flex gap-1">
					<Skeleton className="h-6 w-6 rounded" />
					<Skeleton className="h-6 w-6 rounded" />
				</div>
				<Skeleton className="h-3 w-20" />
			</div>
		</div>
	);
}

export function SkeletonColumn() {
	return (
		<div className="flex flex-col gap-3 min-w-[280px]">
			<div className="flex items-center justify-between px-3 py-2">
				<Skeleton className="h-6 w-24" />
				<Skeleton className="h-6 w-8 rounded-full" />
			</div>
			<div className="space-y-3">
				<SkeletonCard />
				<SkeletonCard />
			</div>
		</div>
	);
}
