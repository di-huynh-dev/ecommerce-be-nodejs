"use strict";

const exppress = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const router = exppress.Router();

// Authentication
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));

// Query //
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));

module.exports = router;
