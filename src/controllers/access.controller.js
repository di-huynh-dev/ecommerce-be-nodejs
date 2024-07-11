"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  login = async (req, res, next) => {
    new SuccessResponse({
      message: "Login successfully!",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signup = async (req, res, next) => {
    new CREATED({
      message: "Registered successfully!",
      metadata: await AccessService.signup(req.body),
      options: {
        limit: 20,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
