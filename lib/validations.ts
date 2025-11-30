import {email, z} from 'zod';

export const SignInSchema = z.object({
    email:z.string()
    .min(1,{message:"Email is Requried"} )
    .email({message:"Please Provide a valid email address"}),
})