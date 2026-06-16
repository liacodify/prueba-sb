"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	children: React.ReactNode;
	title?: string;
	size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
	open,
	onOpenChange,
	children,
	title,
	size = "md",
}: ModalProps) {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	const sizeClasses = {
		sm: "max-w-sm",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
	};

	if (!isMounted) return null;

	return (
		<>
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					<div
						className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in-0 duration-200"
						onClick={() => onOpenChange(false)}
						data-cy="modal-backdrop"
					/>
					<div
						className={cn(
							"relative w-full bg-background rounded-xl shadow-xl ring-1 ring-border overflow-hidden",
							"animate-in fade-in-0 zoom-in-95 duration-200",
							sizeClasses[size],
						)}
						data-cy="solicitud-modal"
					>
						{title && (
							<div className="flex items-center justify-between px-6 py-4 border-b">
								<h2 className="text-lg font-semibold">{title}</h2>
								<Button
									variant="ghost"
									size="icon"
									className="h-8 w-8"
									onClick={() => onOpenChange(false)}
									data-cy="modal-close"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						)}
						<div className="p-6">{children}</div>
					</div>
				</div>
			)}
		</>
	);
}
