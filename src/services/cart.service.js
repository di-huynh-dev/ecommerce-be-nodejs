'use strict'

const { NotFoundError } = require('../core/error.response')
const Cart = require('../models/cart.model')
const { getProductById } = require('../models/repositories/product.repo')

/*
 * 1. Add product to cart
 * 2. reduce product quantity in cart
 * 3. increase product quantity in cart
 * 4. get cart [user]
 * 5. delete cart [user]
 * 6. delete item in cart [user]
 */

class CartService {
  static async createUserCart({ userId, product = {} }) {
    const query = {
        cart_userId: userId,
        cart_state: 'active',
      },
      updateSet = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = {
        upsert: true,
        new: true,
      }
    return await Cart.findOneAndUpdate(query, updateSet, options)
  }

  static async updateUserCart({ userId, product = {} }) {
    const { productId, quantity } = product
    const query = {
        cart_userId: userId,
        'cart_products._id': productId,
        cart_state: 'active',
      },
      updateSet = {
        $inc: {
          'cart_products.$.quantity': quantity,
        },
      },
      options = {
        new: true,
      }
    return await Cart.findOneAndUpdate(query, updateSet, options)
  }

  static async addToCart({ userId, product = {} }) {
    //Check cart exists
    const userCart = await Cart.findOne({ cart_userId: userId })
    if (!userCart) {
      //create new cart
      return await CartService.createUserCart({ userId, product })
    }

    // if cart has no product
    if (!userCart.cart_products.lenght) {
      userCart.cart_products = [product]
      return await userCart.save()
    }

    // if cart has this product, increase quantity
    return await CartService.updateUserCart({ userId, product })
  }
  /*   shop_order_ids = [
  {
    shopId,
    item_products : [
      {
        quantity,
        price,
        shopId,
        old_quantity,
        productId
      }
    ],
    version
  }
]*/

  //Add to cart v2
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, oldQuantity } = shop_order_ids[0]?.item_products[0]

    const foundProduct = await getProductById({ product_id: productId })

    if (!foundProduct) throw new NotFoundError('Product not found')

    //Check
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product not found')
    }

    if (quantity === 0) {
      return await CartService.deleleUserCart({ userId, productId })
    }

    return await CartService.updateUserCart({
      userId,
      product: {
        productId,
        quantity: oldQuantity + quantity,
      },
    })
  }

  //Delete cart

  static deleleUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      }
    const deleteCart = Cart.updateOne(query, updateSet)

    return deleteCart
  }

  static async getListUserCart({ userId }) {
    return await Cart.findOne({ cart_userId: userId, cart_state: 'active' }).lean()
  }
}

module.exports = CartService
