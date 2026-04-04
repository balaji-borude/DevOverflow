"use client";

// This componets is for Edit and Create the Question,

import { AskQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
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
import { Button } from "../ui/button";

// import Editor from "../editor";
// ✅ Add this dynamic import
import dynamic from "next/dynamic";

import { useState } from "react";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/route";
import { Questions } from "@/types/global";
import { type IQuestionDoc } from "@/database/question.model";

const Editor = dynamic(() => import("../editor"), { ssr: false });

interface Params {
  question?: Questions;
  isEdit?: boolean;
}
const QuestionForms = ({ question, isEdit = false }: Params) => {
  const router = useRouter();

  const [tagInput, setTagInput] = useState("");

  // form validation import from ./validations.ts file
  const form = useForm<{
    title: string;
    content: string;
    tags: string[];
  }>({
    resolver: zodResolver(AskQuestionSchema),
    // defaultValues: {
    //   title: question?.title || "",
    //   content: question?.content || "",
    //   tags: question?.tags.map((tag) => tag.name) || [],
    // },
    // ✅ Fix - deduplicate with Set
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: [...new Set(question?.tags.map((tag) => tag.name) || [])],
    },
  });

  // tags
  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    tags: string[],
  ) => {
    if (e.key !== "Enter") return;

    e.preventDefault();
    const value = tagInput.trim();

    if (!value) return;

    if (value.length > 15) {
      form.setError("tags", {
        type: "manual",
        message: "Tag must be under 15 characters",
      });
      return;
    }

    if (tags.includes(value)) {
      form.setError("tags", {
        type: "manual",
        message: "Tag already exists",
      });
      return;
    }

    if (tags.length >= 3) {
      form.setError("tags", {
        type: "manual",
        message: "You can add up to 3 tags only",
      });
      return;
    }

    form.setValue("tags", [...tags, value]);
    setTagInput("");
    form.clearErrors("tags");
  };
  // handler remove tag from the array
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = form
      .getValues("tags")
      .filter((tag) => tag !== tagToRemove);

    form.setValue("tags", updatedTags);
    form.clearErrors("tags");
  };

  interface Props {
    title: string;
    content: string;
    tags: string[];
  }
  // handle create question function
  // ✅ Fix - use if/else
  const handleCreateQuestion = async (data: Props) => {
    if (isEdit && question) {
      const result = await editQuestion({ questionId: question._id, ...data });
      if (result.success) {
        toast.success("Question updated successfully");
        // if (result.data) router.push(ROUTES.QUESTION(result.data._id));
        if (result.data)
          router.push(
            ROUTES.QUESTION(
              (result.data as unknown as IQuestionDoc)._id.toString(),
            ),
          );
      } else {
        toast.error(result?.error?.message || "Failed to update question");
      }
    } else {
      const result = await createQuestion(data);
      if (result.success) {
        toast.success("Question created successfully");
        if (result.data) router.push(ROUTES.QUESTION(result.data._id));
      } else {
        toast.error(result?.error?.message || "Failed to create question");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleCreateQuestion)}
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  {...field}
                  placeholder={`Enter your ${field.name}`}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                />
              </FormControl>

              {/* form description */}
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Be specific and imagine you’re asking a question to another
                person.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* description  */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Detailed explanation of the Problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl>
                <Editor
                  markdown={field.value ?? ""}
                  onChange={field.onChange}
                  editorRef={null}
                />
              </FormControl>

              <FormDescription className="body-regular text-light-500 mt-2.5">
                Introduce the problem and expand on what you put in the title.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* tags */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="Press Enter to add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => handleInputKeyDown(e, field.value ?? [])}
                  className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                />
              </FormControl>

              {/* Tags display BELOW input */}
              {/* Tags display BELOW input */}
              {(field.value ?? []).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {(field.value ?? []).map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-dark-300 px-3 py-1 text-sm text-white dark:bg-primary-100 dark:text-black"
                    >
                      {tag}

                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full p-0.5 hover:bg-black/20 dark:hover:bg-black/10"
                        aria-label={`Remove ${tag}`}
                      >
                        <X size={12} className="cursor-pointer" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <FormDescription className="body-regular text-light-500">
                Add up to 3 tags (e.g. react, nextjs, typescript)
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* button */}
        <div className="mt-16 flex justify-end">
          <Button className="primary-gradient w-fit text-light-900  hover:cursor-pointer">
            {isEdit ? "Edit" : " Ask A Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForms;
