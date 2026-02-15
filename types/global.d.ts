import { NextResponse } from "next/server";


// backend api response type
type ActionResponse<T = null> = {
    success: boolean;
    data?:T;
    error?:{
        message:string;
        details:Record<string,string[]>;
    },
    status?:number;
};

// success Response
type SuccessResponse<T = null> = ActionResponse<T> & {success:true};

// error Response
type ErrorResponse = ActionResponse<undefined> & {success:false};

// type of api error
type APIErrorResponse = NextResponse<ErrorResponse>;

// Regular Api Response 
type APIResponse<T = null> = NextResponse <SuccessResponse<T> | ErrorResponse>;