"use server";
import { ActionResponse, ErrorResponse } from "@/types/global";
import action from "../handlers/action";
import { SignInSchema, SignUpSchema } from "../validations";
import handleError from "../handlers/errors";
import mongoose from "mongoose";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import Account from "@/database/accout.model";
import { signIn } from "@/auth";  
import { NotFoundError } from "../http-errors";

// SignUp with credential
export async function signUpWithCredentials(
  params: AuthCredentials,
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  if (!validationResult.params) {
    return handleError(new Error("Invalid validation result")) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("User already exists");

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) throw new Error("Username already exists");

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create(
      [
        {
          name,
          username,
          email,
        },
      ],
      { session },
    );

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

// Signin with credential
export async function signInWithCredentials(  
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  if (!validationResult.params) {
    return handleError(new Error("Invalid validation result")) as ErrorResponse;
  }

  const { email, password } = validationResult.params;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new NotFoundError("User not found");
    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) throw new NotFoundError("Account not found");
    const isPasswordValid = await bcrypt.compare(
      password,
      existingAccount.password,
    );
    if (!isPasswordValid) throw new Error("Password is incorrect ");

    // await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
