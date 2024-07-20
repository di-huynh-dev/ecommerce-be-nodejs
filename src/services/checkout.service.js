'use strict'

const { BadRequestError } = require('../core/error.response')
const { findCartByUserId } = require('../models/repositories/cart.repo')
const { checkProductByServer } = require('../models/repositories/product.repo')
const { getDiscountAmount } = require('./discount.service')

class CheckoutService {
  /*
    {
      "cartId": "string",
      "userId": "string",
      "shop_order_ids": [
        {
          "shopId": "string",
          "shop_discounts": []
          "item_products": [
            {
              "productId": "string",
              "quantity": 0,
              "price": 0
            }
          ]
        },
        {
          "shopId": "string",
          "shop_discounts": [
          {
            "shopId": "string",
            "discountId": "string",
            "codeId": "string",
          }
          ]
          "item_products": [
            {
              "productId": "string",
              "quantity": 0,
              "price": 0
            }
          ]
        }
      ]
      }
      }
    }
  */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    const foundCart = await findCartByUserId(cartId)

    if (!foundCart) {
      throw new BadRequestError('Cart not found')
    }

    const checkout_order = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    }
    const shop_order_ids_new = []

    // Calculate total price
    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]

      // Check product availability
      const checkProductServer = await checkProductByServer(item_products)

      if (checkProductServer.length === 0) {
        throw new BadRequestError('Order wrong!!!')
      }

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.product_price * product.product_quantity
      }, 0)

      checkout_order.totalPrice += checkoutPrice

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      }

      if (shop_discounts.length > 0) {
        const { totalOrder, discount } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        })

        checkout_order.totalDiscount += discount

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
      shop_order_ids_new.push(itemCheckout)
    }

    return {
      checkout_order,
      shop_order_ids,
      shop_order_ids_new,
    }
  }
}

exports.CheckoutService = CheckoutService
