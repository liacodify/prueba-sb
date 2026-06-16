import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { KeyboardShortcutsProvider } from "@/components/providers/KeyboardShortcutsProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { LocaleProvider } from "@/lib/locale-provider";
import { QueryProvider } from "@/lib/query-provider";
import { SkipNav } from "@/components/SkipNav";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export const metadata: Metadata = {
	title: "Gestor de Solicitudes",
	description: "Sistema de gestión de solicitudes internas",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} min-h-full flex flex-col font-sans antialiased`}
				suppressHydrationWarning
			>
				<SkipNav />
				<ThemeProvider>
					<LocaleProvider>
						<KeyboardShortcutsProvider>
							<QueryProvider>{children}</QueryProvider>
							<Toaster position="top-right" richColors expand />
						</KeyboardShortcutsProvider>
					</LocaleProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
