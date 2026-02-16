import Account from "@/database/accout.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/errors";
import dbConnect from "@/lib/mongodb";
import { UserSchema } from "@/lib/validations";
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
    const validatedData = UserSchema.safeParse(body);
    //console.log("validatedData", validatedData);

    // validating the data
    if (!validatedData.success) {
      return Response.json(
        {
          success: false,
          errors: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // get data from the validated data
    const { email, username } = validatedData.data;

    // check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }
    // check if the username already exists
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const newUser = await User.create(validatedData.data);

    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
