"use strict";

const exppress = require("express");
const accessController = require("../../controllers/access.controller");
const router = exppress.Router();

//Sign up
router.post("/shop/signup", accessController.signup);

module.exports = router;
