import { NextResponse } from "next/server";


export interface Tags {
  _id: string;
  name: string;
  questions?: number;
}

export interface Author {
  _id: string;
  name: string;
  image: string;
}

export interface Questions {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
  answers: number;
  views: number;
}

export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details: Record<string, string[]>;
  };
  status?: number;
};

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

export type ErrorResponse = ActionResponse<undefined> & { success: false };

export type APIErrorResponse = NextResponse<ErrorResponse>;

export type APIResponse<T = null> = NextResponse<
  SuccessResponse<T> | ErrorResponse
>;

export interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
};

export interface Answers {
  _id: string;
  author: Author;
  content: string;
  createdAt: Date | string;
  question?: string;
  upvotes: number;
  downvotes: number;
};


interface User{
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}
