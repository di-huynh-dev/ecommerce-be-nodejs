"use strict";

const exppress = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");
const router = exppress.Router();

//Sign up
router.post("/shop/signup", asyncHandler(accessController.signup));

//Sign in
router.post("/shop/login", asyncHandler(accessController.login));

// Authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);
module.exports = router;
