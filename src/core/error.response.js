"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
};

const ReasonsStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict request error",
  UNAUTHORIZED: "Unauthorized error",
  NOT_FOUND: "Not found error",
};
class ErrorResponse extends Error {
  constructor(message, status) {
    super(message, status);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class UnauthorizedError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.UNAUTHORIZED,
    statusCode = StatusCode.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.NOT_FOUND,
    statusCode = StatusCode.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorResponse {
  constructor(
    message = ReasonsStatusCode.FORBIDDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  BadRequestError,
  ConflictRequestError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
};
