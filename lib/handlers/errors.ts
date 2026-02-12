// this file is used to handle the errors in the application
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { RequestError, ValidationError } from "../http-errors";
import Logger from "../logger";

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
    //showing the errors to the user--> using Logger
    Logger.error({err:error},`{${responseType.toUpperCase()} Error: ${error.message}}`);

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

    Logger.error({err:error},`Validation Error: ${validationError.message}}`);

    return formateResponse(
      responseType,
      validationError.message,
      validationError.statusCode,
      validationError.errors,
    );
  }

  if (error instanceof Error) {

    Logger.error(`Error: ${error.message}}`); 

    return formateResponse(responseType, error.message, 500);
  }

  Logger.error({err:error},`Something went wrong`);
  return formateResponse(
    responseType, "Something went wrong", 
    500,
  );
};

export default handleError;
 