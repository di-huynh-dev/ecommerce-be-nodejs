"use strict";

const { CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
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
