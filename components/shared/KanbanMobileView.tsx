"use client";

import { Plus } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";
import type { Solicitud, Status } from "@/types";
import { KanbanCard } from "./KanbanCard";

const STATUSES: Status[] = [
  "pending",
  "in_review",
  "approved",
  "rejected",
  "closed",
];

interface KanbanMobileViewProps {
  solicitudes: Solicitud[];
  activeTab: Status;
  onTabChange: (status: Status) => void;
  onCardClick: (solicitud: Solicitud) => void;
  onStatusChange: (id: string, status: Status) => void;
  onCreateClick: () => void;
  isLoading?: boolean;
}

export function KanbanMobileView({
  solicitudes,
  activeTab,
  onTabChange,
  onCardClick,
  onStatusChange,
  onCreateClick,
  isLoading,
}: KanbanMobileViewProps) {
  const { t } = useTranslations();

  const getSolicitudesByStatus = (status: Status) => {
    return solicitudes.filter((s) => s.status === status);
  };

  const activeSolicitudes = getSolicitudesByStatus(activeTab);

  return (
    <div className="flex flex-col h-full w-full min-h-0 overflow-hidden touch-pan-y">

      <div className="flex border-b overflow-x-auto shrink-0 [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [&::-moz-scrollbar]:hidden">
        {STATUSES.map((status) => {
          const count = getSolicitudesByStatus(status).length;
          return (
            <button
              type="button"
              key={status}
              onClick={() => onTabChange(status)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === status
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              <StatusBadge status={status} />
              <span
                className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full text-xs",
                  count === 0
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 overscroll-contain [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [&::-moz-scrollbar]:hidden">
        <div className="space-y-3">
          {activeSolicitudes.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
              Sin solicitudes
            </div>
          ) : (
            activeSolicitudes.map((solicitud) => (
              <KanbanCard
                key={solicitud.id}
                solicitud={solicitud}
                onClick={() => onCardClick(solicitud)}
                onStatusChange={(status) =>
                  onStatusChange(solicitud.id, status)
                }
                isLoading={isLoading}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
