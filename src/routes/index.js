"use strict";

const exppress = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = exppress.Router();

//Check apikey
router.use(apiKey);
//Check permission
router.use(permission("000"));

router.use("/v1/api", require("./access"));
router.use("/v1/api/product", require("./product"));

module.exports = router;
