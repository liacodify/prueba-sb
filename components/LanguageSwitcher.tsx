"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type Locale, useLocale } from "@/lib/locale-context";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
	const { locale, setLocale } = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	const toggleLocale = (newLocale: Locale) => {
		setLocale(newLocale);
		const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
		router.push(newPath);
	};

	return (
		<div className="flex items-center gap-1">
			<Button
				variant="outline"
				size="sm"
				onClick={() => toggleLocale("es")}
				className={cn(
					"h-8 px-2 text-xs font-medium",
					locale === "es" && "bg-accent text-accent-foreground border-primary",
				)}
				aria-label="Cambiar a español"
			>
				ES
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => toggleLocale("en")}
				className={cn(
					"h-8 px-2 text-xs font-medium",
					locale === "en" && "bg-accent text-accent-foreground border-primary",
				)}
				aria-label="Switch to English"
			>
				EN
			</Button>
		</div>
	);
}
