"use strict";

const StatusCode = {
  FORBIDDEN: 403,
  CONFLICT: 409,
};

const ReasonsStatusCode = {
  FORBIDDEN: "Bad request error",
  CONFLICT: "Conflict request error",
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

module.exports = { BadRequestError, ConflictRequestError };
