'use strict'

const exppress = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const discountController = require('../../controllers/discount.controller')
const { authenticationV2 } = require('../../auth/authUtils')
const router = exppress.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodeWithProduct))

router.use(authenticationV2)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCodes))

module.exports = router
