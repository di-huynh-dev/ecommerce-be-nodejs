'use strict'

const exppress = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const checkoutController = require('../../controllers/checkout.controller')
const router = exppress.Router()

router.post('/review', asyncHandler(checkoutController.checkoutRevieww))

module.exports = router
