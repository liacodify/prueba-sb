"use client";

import { FileText, LayoutDashboard, Menu, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/providers/SidebarProvider";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";

const navItems = [
	{ href: "/", labelKey: "dashboard.title", icon: LayoutDashboard },
	{ href: "/solicitudes", labelKey: "solicitudes.title", icon: FileText },
];

export function TopBar() {
	const { t } = useTranslations();
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const { setIsOpen } = useSidebar();

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<header className="sticky top-0 z-50 flex h-16 items-center gap-2 border-b bg-background px-4 md:px-6">
			{/* Mobile Header */}
			<div className="flex md:hidden items-center gap-3">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => setIsOpen(true)}
					aria-label="Abrir menú"
					className="focus-visible:ring-2 focus-visible:ring-ring"
				>
					<Menu className="h-5 w-5" />
				</Button>
				<span className="font-semibold text-foreground">Gestor de Solicitudes</span>
			</div>

			{/* Desktop Navigation */}
			<nav className="hidden md:flex items-center gap-1 ml-4">
				{navItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						pathname === item.href ||
						(item.href !== "/" && pathname.startsWith(item.href));

					return (
						<Link key={item.href} href={item.href}>
							<Button
								variant={isActive ? "default" : "ghost"}
								size="sm"
								className={cn(
									"gap-2",
									isActive
										? "bg-primary text-primary-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground",
								)}
							>
								<Icon className="h-4 w-4" aria-hidden="true" />
								{t(item.labelKey)}
							</Button>
						</Link>
					);
				})}
			</nav>

			{/* Spacer */}
			<div className="flex-1" />

			{/* Actions */}
			<div className="flex items-center gap-1">
				<LanguageSwitcher />

				<Button
					variant={mounted && theme === "dark" ? "default" : "ghost"}
					size="icon"
					onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
					aria-label={
						!mounted
							? "Cambiar tema"
							: theme === "dark"
								? "Cambiar a modo claro"
								: "Cambiar a modo oscuro"
					}
					className={cn(
						"focus-visible:ring-2 focus-visible:ring-ring",
						mounted && theme === "dark" && "bg-primary text-primary-foreground"
					)}
				>
					{!mounted ? (
						<Moon className="h-5 w-5" />
					) : theme === "dark" ? (
						<Sun className="h-5 w-5" />
					) : (
						<Moon className="h-5 w-5" />
					)}
				</Button>
			</div>
		</header>
	);
}
