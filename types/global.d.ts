import { NextResponse } from "next/server";
import { Questions } from '@/types/global';
import { JSX } from "react/jsx-runtime";

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
  map(arg0: (question: QuestionProps) => JSX.Element): import("react").ReactNode;
  _id: string;
  title: string;
  content:string;
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


// interface for the pagination search params (homepage for displaying all the questions );

interface PaginatedSearchParams{
  page?:number;
  pageSize?:number;
  query?:string;
  filter?:string;
  sort?:string;
}