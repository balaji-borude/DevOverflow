"use client";

import AuthForms from "@/components/forms/AuthForms";
import { signInWithCredentials } from "@/lib/actions/auth.action";
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
        onSubmit={signInWithCredentials}
      />
    </div>
  );
};

export default SignIn;
