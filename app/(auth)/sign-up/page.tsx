"use client";
import AuthForms from '@/components/forms/AuthForms';

import { SignUpSchema } from '@/lib/validations';
import React from 'react'

const SignUp = () => {
  return (
    <div>SignUp
      <AuthForms
        formType="SIGN_UP"
        Schema={SignUpSchema}
        defaultValues={{ email: "", password: "",name:"",username:"" }}
        onSubmit={(data) => 
          Promise.resolve({ success: true })
        }
      />
      
    </div>
  )
}

export default SignUp