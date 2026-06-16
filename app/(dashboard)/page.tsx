"use client";

import { Suspense, lazy, useState } from "react";
import { motion } from "framer-motion";
import {
  Archive,
  CheckCircle,
  Clock,
  FileText,
  Search,
  XCircle,
  Plus,
  Eye,
  Activity,
  TrendingUp,
  TrendingDown,
  Inbox,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { ErrorState } from "@/components/shared/ErrorState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { SolicitudModal } from "@/components/shared/SolicitudModal";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSolicitudes } from "@/features/solicitudes/hooks/use-solicitudes";
import { usePatchSolicitud } from "@/features/solicitudes/hooks/use-solicitudes";
import { useTranslations } from "@/lib/use-translations";
import { cn } from "@/lib/utils";
import type { Status, Solicitud } from "@/types";

const StatusPieChartComponent = lazy(() =>
  import("@/components/shared/StatusPieChart").then((m) => ({
    default: m.StatusPieChart,
  })),
);

const getStatusConfig = (t: (key: string) => string) => ({
  pending: { icon: Clock, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-950", label: t("solicitudes.statuses.pending") },
  in_review: { icon: Search, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-950", label: t("solicitudes.statuses.in_review") },
  approved: { icon: CheckCircle, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-950", label: t("solicitudes.statuses.approved") },
  rejected: { icon: XCircle, color: "text-red-600 dark:text-red-400", bgColor: "bg-red-50 dark:bg-red-950", label: t("solicitudes.statuses.rejected") },
  closed: { icon: Archive, color: "text-slate-600 dark:text-slate-400", bgColor: "bg-slate-100 dark:bg-slate-800", label: t("solicitudes.statuses.closed") },
});

export default function DashboardPage() {
  const { t } = useTranslations();
  const { data, isLoading, isError, refetch } = useSolicitudes();
  const patchMutation = usePatchSolicitud();
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const statusConfig = getStatusConfig(t);

  const solicitudes = data?.data ?? [];

  if (isError) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const summary = {
    total: solicitudes.length,
    pending: solicitudes.filter((s) => s.status === "pending").length,
    in_review: solicitudes.filter((s) => s.status === "in_review").length,
    approved: solicitudes.filter((s) => s.status === "approved").length,
    rejected: solicitudes.filter((s) => s.status === "rejected").length,
    closed: solicitudes.filter((s) => s.status === "closed").length,
  };

  const recentSolicitudes = [...solicitudes]
    .sort((a, b) => new Date(b.lastChangeDate).getTime() - new Date(a.lastChangeDate).getTime())
    .slice(0, 6);

  const approvalRate = summary.total > 0 ? Math.round((summary.approved / summary.total) * 100) : 0;
  const rejectionRate = summary.total > 0 ? Math.round((summary.rejected / summary.total) * 100) : 0;
  const inProcess = summary.in_review + summary.pending;

  const handleStatusChange = async (id: string, status: Status) => {
    patchMutation.mutate({ id, data: { status } });
  };

  const handleCardClick = (solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud);
    setIsDetailOpen(true);
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto bg-gradient-to-br from-muted/50 to-muted/30 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("dashboard.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          <Card data-cy="summary-card" className="border-2 border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 dark:border-primary/30 dark:from-primary/20 dark:to-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
              <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                {t("dashboard.total")}
              </CardTitle>
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl md:text-3xl font-bold">{summary.total}</div>
              )}
            </CardContent>
          </Card>

          {(["pending", "in_review", "approved", "rejected", "closed"] as Status[]).map((status) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            const count = summary[status];

            return (
              <Card
                key={status}
                data-cy="summary-card"
                className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-1 pt-3 px-4">
                  <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {config.label}
                  </CardTitle>
                  <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg transition-colors group-hover:scale-110", config.bgColor)}>
                    <Icon className={cn("h-3.5 w-3.5", config.color)} />
                  </div>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  {isLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <div className="text-2xl md:text-3xl font-bold">{count}</div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 grid-cols-1 lg:grid-cols-3"
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-2 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">{t("solicitudes.statuses.pending").split(" ")[0]}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="h-[180px] flex items-center justify-center">
                  <Skeleton className="h-[180px] w-full rounded-full" />
                </div>
              ) : summary.total === 0 ? (
                <div className="h-[180px] flex flex-col items-center justify-center text-muted-foreground">
                  <Inbox className="h-12 w-12 mb-2 opacity-50" />
                  <p className="text-sm">{t("common.noResults")}</p>
                </div>
              ) : (
                <Suspense fallback={<Skeleton className="h-[180px] w-full" />}>
                  <StatusPieChartComponent solicitudes={solicitudes} />
                </Suspense>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">{t("dashboard.statistics")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("dashboard.approvalRate")}</span>
                      <Badge variant="outline" className="text-emerald-600 dark:text-emerald-500 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/30">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {approvalRate}%
                      </Badge>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${approvalRate}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("dashboard.rejectionRate")}</span>
                      <Badge variant="outline" className="text-red-600 dark:text-red-500 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/30">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {rejectionRate}%
                      </Badge>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${rejectionRate}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-red-500"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{t("dashboard.inProcess")}</span>
                      <span className="text-lg font-semibold flex items-center gap-1">
                        <Clock className="h-4 w-4 text-blue-500" />
                        {inProcess}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{t("dashboard.closed")}</span>
                      <span className="font-medium flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        {summary.closed}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <CardTitle className="text-base">{t("dashboard.quickActions")}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Link href="/solicitudes/new" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 group hover:bg-primary/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{t("solicitudes.new")}</p>
                      <p className="text-xs text-muted-foreground">Crear nueva solicitud</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </Link>
              <Link href="/solicitudes" className="block">
                <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 group hover:bg-primary/5 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3 w-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                      <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{t("dashboard.viewAll")}</p>
                      <p className="text-xs text-muted-foreground">{t("dashboard.viewAllSolicitudes")}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="pb-3 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">{t("dashboard.recentSolicitudes")}</CardTitle>
                </div>
                <Link href="/solicitudes">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
                    {t("dashboard.viewAll")}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : recentSolicitudes.length > 0 ? (
                <div data-cy="recent-solicitudes" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recentSolicitudes.map((solicitud, index) => {
                    const config = statusConfig[solicitud.status] ?? statusConfig.pending;
                    const Icon = config.icon;

                    return (
                      <motion.div
                        key={solicitud.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div
                          onClick={() => handleCardClick(solicitud)}
                          className="group p-4 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-md h-full"
                          data-cy="recent-card"
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg shrink-0 transition-transform group-hover:scale-110", config.bgColor)}>
                              <Icon className={cn("h-4 w-4", config.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                                  {solicitud.title}
                                </h4>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {solicitud.requester}
                              </p>
                              <div className="flex items-center gap-2">
                                <StatusBadge status={solicitud.status} />
                                <PriorityBadge priority={solicitud.priority} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Inbox className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>{t("dashboard.noRecent")}</p>
                  <Link href="/solicitudes/new" className="mt-3 inline-block">
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      {t("dashboard.createFirst")}
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <SolicitudModal
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        solicitud={selectedSolicitud}
        onDelete={(id) => {
          setIsDetailOpen(false);
        }}
        onStatusChange={(solicitud) => {
          handleStatusChange(solicitud.id, solicitud.status);
        }}
      />
    </div>
  );
}
