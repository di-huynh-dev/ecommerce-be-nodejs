'use strict'

const { OK } = require('../core/success.response')
const { CheckoutService } = require('../services/checkout.service')

class CheckoutController {
  checkoutRevieww = async (req, res, next) => {
    new OK({
      message: 'Checkout successfully!',
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res)
  }
}

module.exports = new CheckoutController()
