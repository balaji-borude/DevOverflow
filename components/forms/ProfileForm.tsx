"use client";

import { UpdateUserSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { updateUserProfile } from "@/lib/actions/user.action";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/route";
import { User as UserType } from "@/types/global";

interface Params {
  user: UserType;
}

const ProfileForm = ({ user }: Params) => {
  const router = useRouter();

  const form = useForm<{
    userId: string;
    name?: string;
    username?: string;
    email?: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
  }>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      userId: user._id,
      name: user.name || "",
      username: user.username || "",
      email: user.email || "",
      bio: user.bio || "",
      image: user.image || "",
      location: user.location || "",
      portfolio: user.portfolio || "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: {
    userId: string;
    name?: string;
    username?: string;
    email?: string;
    bio?: string;
    image?: string;
    location?: string;
    portfolio?: string;
  }) => {
    try {
      // Only include fields that have been changed and are not empty
      const updatedValues = {
        userId: values.userId,
        ...(values.name && values.name !== user.name && { name: values.name }),
        ...(values.username && values.username !== user.username && { username: values.username }),
        ...(values.email && values.email !== user.email && { email: values.email }),
        ...(values.bio !== undefined && values.bio !== user.bio && { bio: values.bio }),
        ...(values.image !== undefined && values.image !== user.image && { image: values.image }),
        ...(values.location !== undefined && values.location !== user.location && { location: values.location }),
        ...(values.portfolio !== undefined && values.portfolio !== user.portfolio && { portfolio: values.portfolio }),
      };

      // Check if any fields were actually updated
      const hasUpdates = Object.keys(updatedValues).length > 1;
      
      if (!hasUpdates) {
        toast.info("No changes detected");
        return;
      }

      const result = await updateUserProfile(updatedValues);
      
      if (result.success) {
        toast.success("Profile updated successfully!");
        router.push(ROUTES.PROFILE(user._id));
      } else {
        toast.error(result.error?.message || "Failed to update profile");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="paragraph-semibold text-dark300_light900">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    placeholder="Your full name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="paragraph-semibold text-dark300_light900">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    placeholder="Your username"
                  />
                </FormControl>
                <FormDescription className="body-regular text-light500_light700">
                  Only letters, numbers, and underscores are allowed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="paragraph-semibold text-dark300_light900">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    placeholder="your.email@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location Field */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="paragraph-semibold text-dark300_light900">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    placeholder="City, Country"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Portfolio Field */}
          <FormField
            control={form.control}
            name="portfolio"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="paragraph-semibold text-dark300_light900">
                  Portfolio URL
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    placeholder="https://yourportfolio.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Image URL Field */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="paragraph-semibold text-dark300_light900">
                  Profile Image URL
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                    placeholder="https://example.com/image.jpg"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bio Field */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="paragraph-semibold text-dark300_light900">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
                  placeholder="Tell us about yourself..."
                />
              </FormControl>
              <FormDescription className="body-regular text-light500_light700">
                Brief description about yourself (optional)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="paragraph-medium btn-secondary text-dark300_light900 min-h-[46px] px-4 py-3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="paragraph-medium primary-gradient min-h-[46px] px-4 py-3 text-light-900"
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProfileForm;
