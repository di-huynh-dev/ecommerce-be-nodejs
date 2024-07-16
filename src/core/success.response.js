"use strict";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonsStatusCode = {
  OK: "OK",
  CREATED: "Created",
};

class SuccessResponse {
  constructor(
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonsStatusCode.OK,
    metadata = {}
  ) {
    this.message = message || reasonStatusCode;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.statusCode).json({
      message: this.message,
      statusCode: this.statusCode,
      metadata: this.metadata,
    });
  }
}

class OK extends SuccessResponse {
  constructor({ message, statusCode = StatusCode.OK, metadata }) {
    super(message, statusCode, ReasonsStatusCode.OK, metadata);
  }
}

class CREATED extends SuccessResponse {
  constructor({
    options = {},
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonsStatusCode.CREATED,
    metadata,
  }) {
    super(message, statusCode, reasonStatusCode, metadata);
    this.options = options;
  }
}

module.exports = { OK, CREATED, SuccessResponse };
