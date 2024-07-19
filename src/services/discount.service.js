'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const discountModel = require('../models/discount.model')
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
  findAllDiscountCodesSelect,
} = require('../models/repositories/discount.repo')
const { findAllProducts } = require('../models/repositories/product.repo')
const { convertToObjectId } = require('../utils')

/*
 * 1. Gerate discount code [Shop | Admin]
 * 2. Get all discounts [Shop | User]
 * 3. Get all products by discount code [ User]
 * 4. Get discount amount
 * 5. Delete discount code [Admin | Shop]
 * 6. Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload

    // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
    //   throw new BadRequestError('Invalid date')
    // }

    //create index for discount code
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: code, discount_shopId: convertToObjectId(shopId) },
      model: discountModel,
    })

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError('Invalid date')
    }

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError('Discount code already exists')
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_usage: max_uses,
      discount_used_count: uses_count,
      discount_users_used: users_used,
      discount_max_amount: max_value,
      discount_min_order_value: min_order_value || 0,
      discount_shopId: shopId,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === 'all' ? [] : product_ids,
      discount_max_uses_per_user: max_uses_per_user,
    })

    return newDiscount
  }

  static updateDiscountCode() {}

  static async getAllDiscountCodeWithProduct({ code, shopId, userId, limit, page }) {
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: code, discount_shopId: convertToObjectId(shopId) },
      model: discountModel,
    })

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError('Discount code not found')
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount

    let products

    if (discount_applies_to === 'specific') {
      products = await findAllProducts({
        limit: +limit,
        sort: 'ctime',
        page: +page,
        select: ['product_name'],
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
      })
    }

    if (discount_applies_to === 'all') {
      products = await findAllProducts({
        limit: +limit,
        sort: 'ctime',
        page: +page,
        select: ['product_name'],
        filter: {
          product_shop: convertToObjectId(shopId),
          isPublished: true,
        },
      })
    }

    return products
  }

  static async getAllDiscountCodesByShop({ shopId, limit, page }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      select: ['discount_code', 'discount_name'],
      model: discountModel,
    })

    return discounts
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: codeId, discount_shopId: convertToObjectId(shopId) },
      model: discountModel,
    })
    if (!foundDiscount) {
      throw new NotFoundError('Discount code not found')
    }

    const {
      discount_is_active,
      discount_type,
      discount_min_order_value,
      discount_max_usage,
      discount_start_date,
      discount_end_date,
      discount_max_uses_per_user,
      discount_value,
      discount_users_used,
    } = foundDiscount

    if (!discount_is_active) throw new BadRequestError('Discount code is not active')
    if (!discount_max_usage) throw new BadRequestError('Discount code is unlimited')

    if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
      throw new BadRequestError('Invalid date')
    }

    let totalOrder = 0
    //Check min order value
    if (discount_min_order_value > 0) {
      products.forEach((product) => {
        totalOrder += product.price * product.quantity
      })

      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError('Minimum order value not met')
      }
    }

    if (discount_max_uses_per_user > 0) {
      const foundUser = discount_users_used.find((user) => user.userId === userId)
      if (foundUser) {
        if (foundUser.uses_count >= discount_max_uses_per_user) {
          throw new BadRequestError('Discount code is limited')
        }
      }
    }

    const amount = discount_type === 'fixed_amount' ? discount_value : (totalOrder * discount_value) / 100

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    }
  }

  static async deleteDiscountCode({ codeId, shopId }) {
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: codeId, discount_shopId: convertToObjectId(shopId) },
      model: discountModel,
    })

    if (!foundDiscount) {
      throw new NotFoundError('Discount code not found')
    }

    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectId(shopId),
    })

    return deleted
  }

  static async cancelDiscountCode(codeId, shopId, userId) {
    const foundDiscount = await checkDiscountExists({
      filter: { discount_code: codeId, discount_shopId: convertToObjectId(shopId) },
      model: discountModel,
    })

    if (!foundDiscount) throw new NotFoundError('Discount code not found')

    const result = discountModel.findByIdAndDelete(foundDiscount._id, {
      $pull: {
        discount_users_used: convertToObjectId(userId),
      },
      $inc: {
        discount_uses_count: -1,
        discount_max_uses: 1,
      },
    })

    return result
  }
}

module.exports = DiscountService
