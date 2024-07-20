'use strict'

const Cart = require('../cart.model')

const findCartByUserId = async (cartId) => {
  return await Cart.findOne({ cart_userId: cartId, cart_state: 'active' }).lean()
}

module.exports = {
  findCartByUserId,
}
