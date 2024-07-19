'use strict'

const { OK } = require('../core/success.response')
const DiscountService = require('../services/discount.service')

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new OK({
      message: 'Create new discount code successfully!',
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res)
  }

  getAllDiscountCodes = async (req, res, next) => {
    new OK({
      message: 'Get all discounts successfully!',
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res)
  }

  getDiscountAmount = async (req, res, next) => {
    new OK({
      message: 'Get discount amount successfully!',
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res)
  }

  getAllDiscountCodeWithProduct = async (req, res, next) => {
    new OK({
      message: 'Get all discounts successfully!',
      metadata: await DiscountService.getAllDiscountCodeWithProduct({ ...req.query }),
    }).send(res)
  }
}

module.exports = new DiscountController()
