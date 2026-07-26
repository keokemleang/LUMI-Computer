"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
/**
 * Inline action buttons used inside mobile admin cards.
 * Mirrors RowActions (View link + Edit toast + Delete confirm toast)
 * but rendered as a full-width row of icon buttons instead of a dropdown.
 */
export function MobileRowActions({
  viewHref,
  viewLabel = "View",
  itemName,
  onEdit
}) {
  function handleEdit() {
    if (onEdit) {
      onEdit();
      return;
    }
    toast.info("Edit (demo)", {
      description: itemName ? `An edit form for “${itemName}” would open here.` : "An edit form would open here."
    });
  }
  function handleDelete() {
    toast(`Delete${itemName ? ` “${itemName}”` : ""}?`, {
      description: "This is a demo — nothing is actually deleted.",
      action: {
        label: "Confirm",
        onClick: () => toast.success("Deleted (demo)", {
          description: itemName ? `“${itemName}” would be removed.` : "The record would be removed."
        })
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      },
      duration: 8000
    });
  }
  return <div className="mt-3 flex items-center gap-2">
      {viewHref && <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={viewHref}>
            <Eye className="h-3.5 w-3.5" />
            {viewLabel}
          </Link>
        </Button>}
      <Button variant="outline" size="sm" onClick={handleEdit} className={viewHref ? "flex-1" : "flex-1"}>
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
      <Button variant="outline" size="sm" onClick={handleDelete} className="text-destructive hover:text-destructive">
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </Button>
    </div>;
}
