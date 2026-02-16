import User from "@/database/user.model";
import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { success } from "zod";

// get uer by email 
export async function POST(request: Request) {
    try {
        const {email} = await request.json();
        console.log("Email from request --> ",email);

        const validatedData = UserSchema.partial().safeParse({email});
        console.log("Email Validated --> ",validatedData.data);

        if(!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);

        const user = await User.findOne({email});

        if(!user) throw new NotFoundError("User");

        return NextResponse.json({
            success:true,
            data:user,
            message:"User found successfully"
        },{status:200});

    } catch (error) {
        return handleError(error, "api")as APIErrorResponse;
    }
}