// this file is used to handle the errors in the application
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RequestError, ValidationError } from "../http-errors";

export type ResponseType = "api" | "server";

const formateResponse = (
  responseType: ResponseType,
  message: string,
  status: number,
  errors?: Record<string, string[]>,
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };
  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

const handleError = (error: unknown, responseType: ResponseType = "server") => {
  if (error instanceof RequestError) {
    return formateResponse(
      responseType,
      error.message,
      error.statusCode,
      error.errors,
    );
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>,
    );

    return formateResponse(
      responseType,
      validationError.message,
      400,
      validationError.errors,
    );
  }

  if (error instanceof Error) {
    return formateResponse(responseType, error.message, 500);
  }

  return formateResponse(responseType, "Something went wrong", 500);
};
