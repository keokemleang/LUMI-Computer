"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AddButtonProps {
  label?: string;
  toastTitle?: string;
  toastDescription?: string;
}

export function AddButton({
  label = "Add",
  toastTitle = "Opening form…",
  toastDescription = "This is a demo — no record will be created.",
}: AddButtonProps) {
  return (
    <Button
      onClick={() =>
        toast.info(toastTitle, {
          description: toastDescription,
        })
      }
    >
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
}
