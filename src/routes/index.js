"use strict";

const exppress = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = exppress.Router();

//Check apikey
router.use(apiKey);
//Check permission
router.use(permission("0001"));

router.use("/v1/api", require("./access"));
// router.get("", (req, res) => {
//   return res.status(200).json({ message: "Hello World" });
// });

module.exports = router;
