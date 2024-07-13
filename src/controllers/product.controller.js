"use strict";

const { OK } = require("../core/success.response");

const ProductServiceV2 = require("../services/product.service.xxx");
class ProductController {
  createProduct = async (req, res, next) => {
    // new OK({
    //   message: "Create new product successfully!",
    //   metadata: await ProductFactory.createProduct(req.body.product_type, {
    //     ...req.body,
    //     product_shop: req.user.userId,
    //   }),
    // }).send(res);
    new OK({
      message: "Create new product successfully!",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
