"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  useForm,
  SubmitHandler,
  FieldValues,
  Path,
  DefaultValues,
} from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { AnswerSchema } from "@/lib/validations";
import { useRef, useState } from "react";
// import Editor from "../editor";
import dynamic from "next/dynamic";
import { MDXEditorMethods } from "@mdxeditor/editor";
//import{RealoadIcon} from "radix-ui/icons/Reload";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";

// type for action in ONclick presss //
type ActionResponse = {
  success: boolean;
  status?: number;
  error?: {
    message: string;
  };
};

const Editor = dynamic(() => import("../editor"), { ssr: false });

const AnswerForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiSubmiting, setisAiSubmiting] = useState(false);

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  // form handler
  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    console.log(values);
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
          disabled={isSubmitting}
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
              {isSubmitting ? (
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
