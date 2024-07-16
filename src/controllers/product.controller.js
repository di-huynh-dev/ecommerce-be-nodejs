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

  // Query
  /**
   * @desc Get list of draft products of a shop
   * @param {Number} limit
   * @param {Number} skip
   * @returns {Json}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new OK({
      message: "Get all draft products successfully!",
      metadata: await ProductServiceV2.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // End of Query
}

module.exports = new ProductController();
