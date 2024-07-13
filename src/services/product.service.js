"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

// Define factory class to create product

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing": {
        return new Clothing(payload).createProduct();
      }
      case "Electronic": {
        return new Electronic(payload).createProduct();
      }
      default:
        throw new BadRequestError("Invalid product type");
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attribute,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attribute = product_attribute;
  }

  // Create new product
  async createProduct(productId) {
    return await product.create({ ...this, _id: productId });
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attribute,
      productShop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Create new clothing failed");
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }
    return newProduct;
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attribute,
      productShop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("Create new electronic failed");
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }
    return newProduct;
  }
}

module.exports = ProductFactory;
