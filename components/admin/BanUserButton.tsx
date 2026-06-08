"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { banUser, unbanUser } from "@/lib/actions/admin.action";

interface BanUserButtonProps {
  userId: string;
  isBanned?: boolean;
}

const BanUserButton = ({ userId, isBanned }: BanUserButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleToggleBan = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the profile if this is inside a Link
    e.stopPropagation(); // Stop event bubbling
    startTransition(async () => {
      try {
        if (isBanned) {
          const result = await unbanUser(userId);
          if (result.success) {
            toast.success("User unbanned successfully");
          } else {
            toast.error(result.error?.message || "Failed to unban user");
          }
        } else {
          const result = await banUser(userId);
          if (result.success) {
            toast.success("User banned successfully");
          } else {
            toast.error(result.error?.message || "Failed to ban user");
          }
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <Button
      onClick={handleToggleBan}
      disabled={isPending}
      className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors
        ${
          isBanned
            ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
        }
      `}
    >
      {isPending ? "Updating..." : isBanned ? "Unban User" : "Ban User"}
    </Button>
  );
};

export default BanUserButton;
