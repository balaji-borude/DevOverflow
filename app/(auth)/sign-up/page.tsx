import AuthForms from '@/components/forms/AuthForms';
import SocialAuthForm from '@/components/forms/SocialAuthForm'
import { SignInSchema } from '@/lib/validations';
import React from 'react'

const SignUp = () => {
  return (
    <div>SignUp
      <AuthForms
        formType="SIGN_UP"
        Schema={SignInSchema}
        defaultValues={{ email: "", password: "",name:"",username:"" }}
        onSubmit={(data) => {
          Promise.resolve({ success: true });
        }}
      />
      
    </div>
  )
}

export default SignUp