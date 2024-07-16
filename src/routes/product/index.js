"use strict";

const exppress = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const router = exppress.Router();

// Authentication
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));
router.post("/publish/:id", asyncHandler(productController.publishProduct));
router.post("/unpublish/:id", asyncHandler(productController.unPublishProduct));

// Query //
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublicsForShop)
);

module.exports = router;
