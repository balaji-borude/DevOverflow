import User from "@/database/user.model";
import handleError from "@/lib/handlers/errors";
import { NotFoundError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongodb";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { formUrlQuery } from "../../../../lib/Url";
import { success } from "zod";

// get User By id Route
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    const user = await User.findById(id);
    //or you can use findOne
    //const user = await User.findOne({_id: id});
    if (!user) {
      throw new NotFoundError("User");
    }

    //if user exist
    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// DELETE User By id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // if id not found show error
  if (!id) {
    throw new NotFoundError("User");
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
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError("User");
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// update User By id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // if id not found show error
  if (!id) {
    throw new NotFoundError("User");
  }

  try {
    await dbConnect();

    const body = await request.json();
    // validation
    const validatedData = UserSchema.partial().safeParse(body);
    console.log("data Validated going to Update user ");

    //update user
    const updatedUser = await User.findByIdAndUpdate(id, validatedData.data, {
      new: true,
    });

    if(!updatedUser) {
        throw new NotFoundError("User");
    };
    return NextResponse.json({
        success:true,
        data:updatedUser,
        message:"User updated successfully"
    },{status:200});

  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
