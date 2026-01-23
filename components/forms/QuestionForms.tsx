"use client";

import { AskQuestionSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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
 
import Editor from "../editor";

const QuestionForms = () => {
  // form validation import from ./validations.ts file
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });

  // handle create question function
  const handleCreateQuestion = () => {
    // console.log(data);
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
                  required
                  {...field}
                  placeholder={`Enter your ${field.name}`}
                  {...field}
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
          render={() => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Detailed explanation of the Problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                {/* Editor  */}
                <Editor editorRef={null} markdown={""} />
              </FormControl>

              {/* form description */}
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
                Tags<span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    required
                    {...field}
                    placeholder="Add Tags"
                    {...field}
                    className="paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus min-h-14 border"
                  />
                </div>
              </FormControl>

              {/* form description */}
              <FormDescription className="body-regular text-light-500 mt-2.5">
                Add upto 3 tags to describe what your question is about. you need to press enter to add the tag.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* button */}
        <div className="mt-16 flex justify-end">
          <Button className="primary-gradient w-fit text-light-900">
            Ask A Question
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default QuestionForms;
