"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attribute: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// Define the product type = Clothing
const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

// Define the product type = Electronics
const electronicSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

// Export the model
module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  clothing: mongoose.model("Clothing", clothingSchema),
  electronic: mongoose.model("Electronic", electronicSchema),
};
