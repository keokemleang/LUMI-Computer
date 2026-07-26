import { cn } from "@/lib/utils";

// ---- Status badges ----

export const ORDER_STATUS_BADGE = {
  processing: "bg-info/15 text-info border-info/30",
  shipped: "bg-warning/15 text-warning border-warning/30",
  delivered: "bg-success/15 text-success border-success/30",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30"
};
export const PUBLISH_STATUS_BADGE = {
  published: "bg-success/15 text-success border-success/30",
  draft: "bg-muted text-muted-foreground border-border",
  archived: "bg-destructive/15 text-destructive border-destructive/30"
};
export const ROLE_BADGE = {
  admin: "bg-primary/15 text-primary border-primary/30",
  customer: "bg-muted text-muted-foreground border-border"
};
export const DIFFICULTY_BADGE = {
  Beginner: "bg-success/15 text-success border-success/30",
  Intermediate: "bg-warning/15 text-warning border-warning/30",
  Advanced: "bg-danger/15 text-danger border-danger/30"
};
export const DOWNLOAD_CATEGORY_BADGE = {
  "Source Code": "bg-primary/15 text-primary border-primary/30",
  PCB: "bg-info/15 text-info border-info/30",
  Datasheet: "bg-success/15 text-success border-success/30",
  Manual: "bg-warning/15 text-warning border-warning/30",
  Slides: "bg-danger/15 text-danger border-danger/30",
  Firmware: "bg-info/15 text-info border-info/30",
  Library: "bg-primary/15 text-primary border-primary/30"
};
export function badgeClass(map, key) {
  return map[key ?? ""] ?? "bg-muted text-muted-foreground border-border";
}
export function StatusPill({
  className,
  children
}) {
  return <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium capitalize", className)}>
      {children}
    </span>;
}

// ---- Formatters ----

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
export function formatDate(iso) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
export function formatDateTime(iso) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
