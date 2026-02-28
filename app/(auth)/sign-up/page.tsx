"use client";
import AuthForms from '@/components/forms/AuthForms';
import { signUpWithCredentials } from '@/lib/actions/auth.action';

import { SignUpSchema } from '@/lib/validations';
 
const SignUp = () => {
  return (
    <div>SignUp
      <AuthForms
        formType="SIGN_UP"
        Schema={SignUpSchema}
        defaultValues={{ email: "", password: "",name:"",username:"" }}
        onSubmit={signUpWithCredentials}
        
      />
      
    </div>
  )
}

export default SignUp