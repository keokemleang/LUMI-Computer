"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Package, GraduationCap, Newspaper, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export function QuickActions() {
  const router = useRouter();

  const actions: {
    label: string;
    icon: typeof Package;
    href: string;
    toastMsg: string;
  }[] = [
    {
      label: "Add product",
      icon: Package,
      href: "/admin/products",
      toastMsg: "Opening product form…",
    },
    {
      label: "Add course",
      icon: GraduationCap,
      href: "/admin/courses",
      toastMsg: "Opening course form…",
    },
    {
      label: "Add blog post",
      icon: Newspaper,
      href: "/admin/blog",
      toastMsg: "Opening blog editor…",
    },
  ];

  return (
    <Card className="gap-0">
      <CardContent className="flex flex-wrap items-center gap-3 p-4">
        <span className="text-sm font-medium text-muted-foreground">
          Quick actions
        </span>
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <Button
                key={a.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  toast.info(a.toastMsg);
                  router.push(a.href);
                }}
              >
                <Plus className="h-4 w-4" />
                {a.label}
                <Icon className="h-4 w-4 text-muted-foreground" />
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
