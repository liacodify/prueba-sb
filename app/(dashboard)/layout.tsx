import type { ReactNode } from "react";
import { SidebarProvider } from "@/components/providers/SidebarProvider";
import { Sidebar } from "@/components/shared/Sidebar";
import { SkipToContent } from "@/components/shared/SkipToContent";
import { TopBar } from "@/components/shared/TopBar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<SidebarProvider>
			<SkipToContent />
			<div className="flex h-screen overflow-hidden">
				<Sidebar />
				<div className="flex flex-col flex-1 min-w-0">
					<TopBar />
					<main
						id="main-content"
						className="flex-1 min-h-0 overflow-y-auto bg-muted/50 p-2"
						tabIndex={-1}
					>
						{children}
					</main>
				</div>
			</div>
		</SidebarProvider>
	);
}
