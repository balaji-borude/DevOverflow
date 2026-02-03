// class is used to error handling in the javascript--> here is the only Classes is used in the whole project(or in Application devlopment )

// classes are super simple to use Error Handling in Javascript

// this base class allow us to handle defferent errors in the application
export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    // super(message); --> simply call the parent class and pases the Error message
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequesetError";
  }
}

export class ValidationError extends RequestError
 {
  constructor(fieldErrors: Record<string, string[]>) {
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(400, message, fieldErrors);
    this.name = "ValidationError";
    this.errors = fieldErrors;
  }

  static formatFieldErrors(errors: Record<string, string[]>): string {
    const formattedMessages = Object.entries(errors).map(
      ([fields, messages]) => {
        const fieldName = fields.charAt(0).toUpperCase() + fields.slice(1);

        if (messages[0] === "Required") {
          return `The ${fieldName} is required`;
        } else {
          return messages.join(" and ");
        }
      },
    );
    return formattedMessages.join(" , ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(404, `The ${resource} was not found`);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
