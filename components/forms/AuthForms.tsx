"use client";

// theese import form Zod for validation 
import { string, z, ZodType, success } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { DefaultValues, FieldValues, SubmitHandler, useForm } from "react-hook-form" ; // react hookf form libary 

// Ui shadn components 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

// form schema --> zod 
const formSchema = z.object({
  username: z.string().min(2).max(50),
});

interface AuthFormProps<T extends FieldValues> {
  Schema:ZodType<T>;
  defaultValues:T;
  onSubmit:(data:T)=>Promise<{success:boolean}>;
  formType:"SIGN_IN" | "SIGN_UP";
}

const AuthForms = ({
  Schema,
  defaultValues,
  formType,
  onSubmit
}:AuthFormProps<T>) => {


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:defaultValues as DefaultValues<T>
  });

  // 2. Define a submit handler.
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log(values);
  // }

  const handleSubmit:SubmitHandler<T> =async()=>{

  }

  // 
  const buttonText = formType === "SIGN_IN" ? "SIGN_IN" :"SIGNU_UP"

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )

};

export default AuthForms;
