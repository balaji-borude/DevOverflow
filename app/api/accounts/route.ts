import Account from "@/database/accout.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/errors";
import { ForbiddenError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongodb";
import { accountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

// get all accounts
export async function GET() {
  try {
    await dbConnect();

    // get all accounts
    const accounts = await Account.find();

    return NextResponse.json(
      {
        success: true,
        data: accounts,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// create account 
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    // validation
    const validatedData = accountSchema.parse(body);
    
    // check if the user already exists
    const existingUser = await User.findOne({
        provider: validatedData.provider,
        providerAccountId: validatedData.providerAccountId,
    });

    if (existingUser) {
      throw new ForbiddenError(" An account with this provider and providerAccountId already exists");
    };

 

    const newAccount = await Account.create(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: newAccount,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
