"use client";

import SocialAuthForm from "@/components/forms/SocialAuthForm";
import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AuthForms from "@/components/forms/AuthForms";
import { SignInSchema } from "@/lib/validations";
import { success } from "zod";

const SignIn = () => {
  return (
    <div>
      signInn
      <AuthForms
        formType="SIGN_IN"
        Schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={(data) => {
          Promise.resolve({ success: true });
        }}
      />
    </div>
  );
};

export default SignIn;
