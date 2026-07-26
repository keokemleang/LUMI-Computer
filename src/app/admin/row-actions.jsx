"use client";

import * as React from "react";
import Link from "next/link";
import { Eye, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
/**
 * Lightweight row actions dropdown used by read-only admin tables.
 * View links out, Edit fires a toast (demo), Delete fires a confirm toast.
 */
export function RowActions({
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
  return <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Row actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {viewHref && <DropdownMenuItem asChild>
            <Link href={viewHref}>
              <Eye className="h-4 w-4" />
              {viewLabel}
            </Link>
          </DropdownMenuItem>}
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleDelete}>
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>;
}
