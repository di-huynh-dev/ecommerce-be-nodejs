"use strict";

const exppress = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const router = exppress.Router();

//Sign up
router.post("/shop/signup", asyncHandler(accessController.signup));

//Sign in
router.post("/shop/login", asyncHandler(accessController.login));

// Authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));
module.exports = router;
