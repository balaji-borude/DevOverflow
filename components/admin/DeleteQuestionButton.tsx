"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { deleteQuestion } from "@/lib/actions/admin.action";

interface DeleteQuestionButtonProps {
  questionId: string;
}

const DeleteQuestionButton = ({ questionId }: DeleteQuestionButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      try {
        const result = await deleteQuestion({ questionId });
        if (result.success) {
          toast.success("Question deleted successfully");
        } else {
          toast.error(result.error?.message || "Failed to delete question");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isPending}
      variant="destructive"
      className="flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold"
    >
      {isPending ? "Deleting..." : "Delete Question"}
    </Button>
  );
};

export default DeleteQuestionButton;
