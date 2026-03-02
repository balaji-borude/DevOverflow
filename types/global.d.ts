import { NextResponse } from "next/server";
import { Questions } from '@/types/global';

interface Tag {
  _id: string;
  name: string;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}

interface Questions {
  _id: string;
  title: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
  createdAt: Date;
}

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