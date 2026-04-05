"use client";

import { toggleSaveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

const SaveQuestion = ({ questionId }: { questionId: string }) => {

  const session = useSession();

  const userId = session?.data?.user?.id;

  const [isLoading, setIsLoading] = useState(false);

  // function
  const handleSave = async () => {
    if (isLoading) return;
    if (!userId) {
      return toast.warning("Please login to save the question");
    }

    setIsLoading(true);
    try {
      const { success, data, error } = await toggleSaveQuestion({ questionId });

      if (!success || error) {
        throw new Error("Failed to save the question");
      }
      toast.success(
        `Question ${data?.saved ? "saved" : "Removed"} successfully`,
      );
    } catch (error) {
      console.log("Error in saving question", error);
      toast.error("Failed to save the question");
    } finally {
      setIsLoading(false);
    }
  };

  const hasSaved = true; // You can replace this with actual logic to check if the question is already saved by the user
  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star.svg"}
      alt="Save Question"
      width={18}
      height={18}
      className={`cursor-pointer ${isLoading ? "opacity-50" : ""}`}
      aria-label="Save question"
      onClick={handleSave}
    />
  );
};

export default SaveQuestion;
