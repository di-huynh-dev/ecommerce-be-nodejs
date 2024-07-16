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

  //update product
  updateProduct = async (req, res, next) => {
    new OK({
      message: "Update product successfully!",
      metadata: await ProductServiceV2.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProduct = async (req, res, next) => {
    new OK({
      message: "Publish product successfully!",
      metadata: await ProductServiceV2.publicProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProduct = async (req, res, next) => {
    new OK({
      message: "Unpublish product successfully!",
      metadata: await ProductServiceV2.unPublicProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
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

  getAllPublicsForShop = async (req, res, next) => {
    new OK({
      message: "Get all public products successfully!",
      metadata: await ProductServiceV2.findAllPublicsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new OK({
      message: "Get list search products successfully!",
      metadata: await ProductServiceV2.searchProduct(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new OK({
      message: "Get all products successfully!",
      metadata: await ProductServiceV2.findAllProducts(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new OK({
      message: "Get product detail successfully!",
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // End of Query
}

module.exports = new ProductController();
