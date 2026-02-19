
// Geting the Account by the Provider like google and github

import Account from "@/database/accout.model";
import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongodb";
import { accountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

// get uer by email 
export async function POST(request: Request) {
    try {

        await dbConnect();
        
        const {providerAccountId} = await request.json();
       
        const validatedData = accountSchema.partial().safeParse({providerAccountId});
        // console.log("Email Validated --> ",validatedData.data);

        if(!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);

        const account = await Account.findOne({providerAccountId});

        if(!account) throw new NotFoundError("Account");

        return NextResponse.json({
            success:true,
            data:account,
            message:"Account found successfully"
        },{status:200});

    } catch (error) {
        return handleError(error, "api")as APIErrorResponse;
    }
}