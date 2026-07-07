"use client";

import * as React from "react";
import { GraduationCap, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EnrollButtonProps {
  title: string;
  price: number;
}

export function EnrollButton({ title, price }: EnrollButtonProps) {
  const [enrolled, setEnrolled] = React.useState(false);
  const isFree = price === 0;

  const handleEnroll = React.useCallback(() => {
    if (isFree) {
      setEnrolled(true);
      toast.success("Enrolled successfully!", {
        description: `${title} has been added to your learning dashboard.`,
      });
      window.setTimeout(() => setEnrolled(false), 2000);
    } else {
      toast.success("Proceed to checkout", {
        description: `Continue to checkout to enroll in ${title}.`,
      });
    }
  }, [isFree, title]);

  return (
    <Button
      type="button"
      size="lg"
      className="w-full"
      onClick={handleEnroll}
    >
      {enrolled ? (
        <>
          <Check className="h-4 w-4" /> Enrolled
        </>
      ) : isFree ? (
        <>
          <GraduationCap className="h-4 w-4" /> Enroll Now
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" /> Enroll Now
        </>
      )}
    </Button>
  );
}
