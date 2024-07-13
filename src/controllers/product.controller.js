"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductFactory = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    try {
      const product = await ProductFactory.createProduct(
        req.body.product_type,
        req.body
      );
      new SuccessResponse({
        message: "Create new product successfully!",
        metadata: product,
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new ProductController();
