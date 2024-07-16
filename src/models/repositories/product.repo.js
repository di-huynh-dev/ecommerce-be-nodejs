"use strict";

const { update } = require("lodash");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../../models/product.model");

const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

module.exports = { findAllDraftsForShop };
