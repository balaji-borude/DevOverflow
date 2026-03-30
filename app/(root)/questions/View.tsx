"use client";

import { incrementQuestionViews } from "@/lib/actions/question.action";
import { useEffect } from "react";
import { toast } from "sonner";

const View = ({ questionId }: { questionId: string }) => {
    
  const handleIncrement = async () => {
    const result = await incrementQuestionViews({ questionId });

    if (result.success) {
      toast.success("Question views incremented successfully");
    } else {
      toast.error("Failed to increment question views");
    }
  };

  useEffect(() => {
    handleIncrement();
  },[]);

  return null;
};

export default View;
