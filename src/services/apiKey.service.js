"use strict";

const apiKeyModel = require("../models/apiKey.model");
const cryto = require("crypto");

const findById = async (key) => {
  // await apiKeyModel.create({ key: crypto.randomUUID(), permissions: "000" });
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  return objKey;
};

module.exports = { findById };
