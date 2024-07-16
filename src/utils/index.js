"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// ["email", "password", "status", "roles"] => { email: 1, password: 1, status: 1, roles: 1 }
const getSelectData = (select = []) => {
  return Object.fromEntries(
    select.map((item) => {
      return [item, 1];
    })
  );
};

// ["email", "password", "status", "roles"] => { email: 0, password: 0, status: 0, roles: 0 }
const unGetSelectData = (select = []) => {
  return Object.fromEntries(
    select.map((item) => {
      return [item, 0];
    })
  );
};
const removeUndefindObject = (object) => {
  Object.keys(object).forEach((key) => {
    if (object[key] === null) delete object[key];
  });

  return object;
};
const updateNestedObjectParser = (object) => {
  const final = {};
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === "Object" && !Array.isArray(object[key])) {
      const response = updateNestedObjectParser(object[key]);
      Object.keys(response).forEach((k) => {
        final[`${key}.${k}`] = response[k];
      });
    } else {
      final[key] = object[key];
    }
  });
  return object;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  updateNestedObjectParser,
  removeUndefindObject,
};
