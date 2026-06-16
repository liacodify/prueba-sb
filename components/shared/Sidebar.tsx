"use client";

import { FileText, LayoutDashboard, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/", labelKey: "dashboard.title", icon: LayoutDashboard },
	{ href: "/solicitudes", labelKey: "solicitudes.title", icon: FileText },
];

export function Sidebar() {
	const { t } = useTranslations();
	const pathname = usePathname();
	const { isOpen, setIsOpen } = useSidebar();

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		};
		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, setIsOpen]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	return (
		<>
			{isOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/50"
					onClick={() => setIsOpen(false)}
					aria-hidden="true"
				/>
			)}

			<aside
				id="sidebar-nav"
				aria-label="Navegación principal"
				className={cn(
					"fixed left-0 top-0 bottom-0 z-[60] flex flex-col w-72 border-r bg-sidebar text-sidebar-foreground transform transition-transform duration-200 ease-in-out",
					isOpen ? "translate-x-0" : "-translate-x-full",
				)}
			>
				<div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
					<div className="flex items-center gap-3">
						<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
							GS
						</div>
						<span className="font-semibold text-sm">Gestor de Solicitudes</span>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden focus-visible:ring-2 focus-visible:ring-ring"
						onClick={() => setIsOpen(false)}
						aria-label={t("accessibility.closeMenu")}
					>
						<X className="h-5 w-5" />
					</Button>
				</div>

				<nav className="flex-1 space-y-1 p-4">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive =
							pathname === item.href ||
							(item.href !== "/" && pathname.startsWith(item.href));

						return (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsOpen(false)}
								className="block rounded-md focus-visible:ring-2 focus-visible:ring-ring"
							>
								<Button
									variant={isActive ? "secondary" : "ghost"}
									className={cn(
										"w-full justify-start gap-2",
										isActive &&
											"bg-sidebar-accent text-sidebar-accent-foreground",
									)}
									aria-current={isActive ? "page" : undefined}
								>
									<Icon className="h-4 w-4" aria-hidden="true" />
									{t(item.labelKey)}
								</Button>
							</Link>
						);
					})}
				</nav>
			</aside>
		</>
	);
}
