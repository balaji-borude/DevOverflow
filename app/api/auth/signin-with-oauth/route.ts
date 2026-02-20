import Account from "@/database/accout.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/errors";
import dbConnect from "@/lib/mongodb";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import mongoose from "mongoose";
import slugify from "slugify";

// Here Login with Github and Google is handled
export async function POST(request: Request) {

  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  //create a new Monggose Sessioon (it helps to perform multiple operations in a transaction and ensures that all operations either succeed or fail together -->  which is crucial for maintaining data integrity, especially when dealing with related data across multiple collections. )
  const session = await mongoose.startSession();

  // if we try to create an account --> it fails
  // then we not even create the user ==> it aslo faile
  // These are the Atomic function (Atomicity ) property of transactions ensures that all operations within the transaction either succeed or fail together. If any operation fails, the entire transaction is rolled back, and the database state remains unchanged. This is crucial for maintaining data integrity, especially when dealing with related data across multiple collections.

  session.startTransaction();

  try {
    // validate the data
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success) {
      throw new Error(
        JSON.stringify(validatedData.error.flatten().fieldErrors),
      );
    }

    const { name, username, email, image } = user;

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // check user is already exist or not
    // .session is used to ensure that the findOne operation is part of the transaction, allowing it to be rolled back if any subsequent operations fail. This helps maintain data integrity by ensuring that all related operations either succeed or fail together.
    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
       [existingUser] = await User.create(
        [
          {
            name,
            username: slugifiedUsername,
            email,
            image,
          },
        ],
        { session },
      );


    } else {


      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) {
        updatedData.name = name;
      }
      if (existingUser.image !== image) {
        updatedData.image = image;
      }

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData },
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
      provider,
      providerAccountId,
    }).session(session);

    if(!existingAccount){
        await Account.create([
            {userId:existingUser._id, name,image,providerAccountId}
        ])
    };

    await session.commitTransaction();

     
  } catch (error) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    session.endSession();
  }
}
