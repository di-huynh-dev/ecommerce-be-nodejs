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

module.exports = { getInfoData, getSelectData, unGetSelectData };
