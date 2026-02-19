
import Account from "@/database/accout.model";
import handleError from "@/lib/handlers/errors";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongodb";
import { accountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

// get account by ID
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const account = await Account.findById(id);
    //or you can use findOne
    //const user = await User.findOne({_id: id});
    if (!account) {
      throw new NotFoundError("Account");
    }

    //if user exist
    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

// DELETE Account By id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // if id not found show error
  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    // 1. This is one method
    // const user = await User.findById(id);
    // if (!user) {
    //   throw new NotFoundError("User");
    // };
    // //if user exist
    // await User.deleteOne({ _id: id });

    //2. This is another method
    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      throw new NotFoundError("Acccountr");
    }

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};

// update Account By id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // if id not found show error
  if (!id) {
    throw new NotFoundError("Account");
  }

  try {
    await dbConnect();

    const body = await request.json();
    // validation
    const validatedData = accountSchema.partial().safeParse(body);
    // console.log("data Validated going to Update user ");

    if(!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors);

    //update user
    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData.data, {
      new: true,
    });

    if(!updatedAccount) {
        throw new NotFoundError("Account");
    };
    return NextResponse.json({
        success:true,
        data:updatedAccount,
        message:"Account updated successfully"
    },{status:200});

  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
};
