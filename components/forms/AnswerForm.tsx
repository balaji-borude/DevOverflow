"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { AnswerSchema } from "@/lib/validations";
import { useRef, useState, useTransition } from "react";
// import Editor from "../editor";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
//import{RealoadIcon} from "radix-ui/icons/Reload";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import ROUTES from "@/constants/route";
import { useSession } from "next-auth/react";
import { api } from "@/lib/api";

// type for action in ONclick presss //
// type ActionResponse = {
//   success: boolean;
//   status?: number;
//   error?: {
//     message: string;
//   };
// };

interface AnswerFormProps {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

const Editor = dynamic(() => import("../editor"), { ssr: false });

const SUPPORTED_CODE_LANGUAGES = new Set([
  "",
  "bash",
  "c",
  "cpp",
  "css",
  "go",
  "html",
  "java",
  "js",
  "json",
  "jsx",
  "php",
  "python",
  "ruby",
  "scss",
  "ts",
  "tsx",
]);

const normalizeCodeFenceLanguage = (language: string) => {
  const normalizedLanguage = language.trim().toLowerCase();

  if (
    normalizedLanguage === "" ||
    normalizedLanguage === "n/a" ||
    normalizedLanguage === "na" ||
    normalizedLanguage === "none" ||
    normalizedLanguage === "plaintext" ||
    normalizedLanguage === "text" ||
    normalizedLanguage === "txt"
  ) {
    return "";
  }

  if (normalizedLanguage === "javascript") return "js";
  if (normalizedLanguage === "typescript") return "ts";
  if (normalizedLanguage === "py") return "python";
  if (normalizedLanguage === "sh" || normalizedLanguage === "shell")
    return "bash";

  return SUPPORTED_CODE_LANGUAGES.has(normalizedLanguage)
    ? normalizedLanguage
    : "";
};

const sanitizeAiMarkdown = (markdown: string) => {
  const normalizedMarkdown = markdown
    .replace(/\r\n/g, "\n")
    .replace(/<br\s*\/?>/gi, "\n");

  const lines = normalizedMarkdown.split("\n");
  const sanitizedLines: string[] = [];
  let activeFenceMarker: string | null = null;

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!activeFenceMarker) {
      const openingFenceMatch = trimmedLine.match(/^(```+|~~~+)\s*(.*)$/);

      if (openingFenceMatch) {
        const [, marker, rawInfo = ""] = openingFenceMatch;
        const rawLanguage = rawInfo.split(/\s+/)[0] ?? "";
        const normalizedLanguage = normalizeCodeFenceLanguage(rawLanguage);

        activeFenceMarker = marker[0];
        sanitizedLines.push(
          normalizedLanguage ? `\`\`\`${normalizedLanguage}` : "```",
        );
        continue;
      }
    } else {
      const closingFencePattern = new RegExp(`^${activeFenceMarker}{3,}\\s*$`);

      if (closingFencePattern.test(trimmedLine)) {
        sanitizedLines.push("```");
        activeFenceMarker = null;
        continue;
      }
    }

    sanitizedLines.push(line);
  }

  if (activeFenceMarker) {
    sanitizedLines.push("```");
  }

  return sanitizedLines.join("\n").trim();
};

const stripCodeFenceLanguages = (markdown: string) =>
  markdown.replace(/^```[^\n]*$/gm, "```");

const AnswerForm = ({
  questionId,
  questionTitle,
  questionContent,
}: AnswerFormProps) => {
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAiSubmiting, setIsAiSubmiting] = useState(false);

  // only authenticated user can answer
  const session = useSession();

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  // form handler
  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values.content,
      });

      if (result.success) {
        form.reset();
        toast.success("Answer Posted successfully");

        // ai answer changes
        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }

        startAnsweringTransition(() => {
          router.push(ROUTES.QUESTION(questionId));
        });
      } else {
        toast.error(result?.error?.message || "Failed to post answer");
      }
    });
  };

  const generateAiAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast.error("Please login to generate AI Answers");
    }
    setIsAiSubmiting(true);

    try {
      const result = await api.ai.getAnswer({
        question: questionTitle,
        content: questionContent,
      });

      if (!result.success || !result.data) {
        toast.error(result.error?.message || "Failed to generate AI Answers");
        return;
      }

      const formattedAnswers = sanitizeAiMarkdown(result.data);

      if (editorRef.current) {
        try {
          editorRef.current.setMarkdown(formattedAnswers);
          form.setValue("content", formattedAnswers);
        } catch {
          const fallbackMarkdown = stripCodeFenceLanguages(formattedAnswers);
          editorRef.current.setMarkdown(fallbackMarkdown);
          form.setValue("content", fallbackMarkdown);
        }

        form.trigger("content");
      }

      toast.success("AI Answer Generated successfully");
    } catch (error) {
      return toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate AI Answers",
      );
    } finally {
      setIsAiSubmiting(false);
    }
  };

  const editorRef = useRef<MDXEditorMethods>(null);
  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          {" "}
          Write Your answer Here{" "}
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAnswering}
          onClick={generateAiAnswer}
        >
          {isAiSubmiting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin " />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answers"
                width={12}
                height={12}
              />
              <span className=" hover:cursor-pointer">Generate Ai Answer</span>
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10 "
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className=" flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  {/* <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  /> */}
                  <Editor
                    markdown={field.value ?? ""}
                    editorRef={editorRef}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end ">
            <button
              type="submit"
              className="primary-gradient w-fit rounded-xs p-1 hover:cursor-pointer"
            >
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <span className="rounded-2xl">Post Answer</span>
              )}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AnswerForm;
