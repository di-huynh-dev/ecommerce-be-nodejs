"use strict";

const exppress = require("express");
const router = exppress.Router();

router.use("/v1/api", require("./access"));
// router.get("", (req, res) => {
//   return res.status(200).json({ message: "Hello World" });
// });

module.exports = router;
