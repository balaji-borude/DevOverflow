"use client";

import AuthForms from "@/components/forms/AuthForms";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <div>
      SignIn
      {/* import the Auth Form component */}
      <AuthForms
        formType="SIGN_IN"
        Schema={SignInSchema}
        defaultValues={{ email: "", password: "" }}
        onSubmit={(data) => Promise.resolve({ success: true })}
      />
    </div>
  );
};

export default SignIn;
