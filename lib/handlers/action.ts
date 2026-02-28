"use server";
//server action handler


import { ZodError, ZodSchema } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongodb";

type ActionOptions<T> = {
    params?:T;
    schema?:ZodSchema<T>;
    authorize?:boolean;
};

async function action<T>({
    params,
    schema,
    authorize=false, 
}:ActionOptions<T> ){
    // schema validation for sever actions --> means that the client can send any data to the server action, but we want to validate it before processing it.
    //we are succesfully authorized 
    if(schema && params){
        try {
            schema.parse(params);

        } catch (error) {
            if(error instanceof ZodError){
                return new ValidationError(error.flatten().fieldErrors as Record <string, string[]>)
            }else{
                return new Error('Schema Validation Failed');
            }
        }
    }

    let session : Session | null = null;
    if(authorize){
        session= await auth();

        if(session){
            return new UnauthorizedError();
        }
    }

    // connect db 
    await dbConnect();

    return {params, session};
}
export default action;
