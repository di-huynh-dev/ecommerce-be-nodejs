"use strict";

const exppress = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication, authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = exppress.Router();

//Sign up
router.post("/shop/signup", asyncHandler(accessController.signup));

//Sign in
router.post("/shop/login", asyncHandler(accessController.login));

// Authentication
router.use(authenticationV2);

router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
