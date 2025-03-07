'use strict'

const { update } = require('lodash')
const { product, clothing, electronic, furniture } = require('../../models/product.model')
const { Types } = require('mongoose')
const { getSelectData, unGetSelectData, convertToObjectId } = require('../../utils')

const findAllDraftsForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip })
}

const findAllPublicsForShop = async ({ query, limit = 50, skip = 0 }) => {
  return await queryProduct({ query, limit, skip })
}

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch)
  const result = await product
    .find(
      {
        $text: {
          $search: regexSearch,
        },
        isDraft: false,
      },
      {
        score: { $meta: 'textScore' },
      },
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean()

  return result
}

const queryProduct = async ({ query, limit = 50, skip = 0 }) => {
  return await product
    .find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}
const publicProductById = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  })
  if (!foundShop) return null

  foundShop.isDraft = false
  foundShop.isPublished = true

  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const unPublicProductById = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  })
  if (!foundShop) return null

  foundShop.isDraft = true
  foundShop.isPublished = false

  const { modifiedCount } = await foundShop.updateOne(foundShop)

  return modifiedCount
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const products = await product.find(filter).sort(sortBy).skip(skip).limit(limit).select(getSelectData(select)).lean()

  return products
}

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById({ _id: product_id }).select(unGetSelectData(unSelect)).lean()
}

const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
  return await model.findByIdAndUpdate(product_id, payload, {
    new: isNew,
  })
}

const getProductById = async ({ product_id }) => {
  return await product.findOne({ _id: convertToObjectId(product_id) }).lean()
}

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById({
        product_id: product.productId,
      })
      if (foundProduct) {
        return {
          product_price: foundProduct.product_price,
          product_quantity: product.quantity,
          productId: foundProduct.productId,
        }
      }
      return null
    }),
  ).then((results) => results.filter((product) => product !== null))
}

module.exports = {
  findAllDraftsForShop,
  publicProductById,
  unPublicProductById,
  findAllPublicsForShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  getProductById,
  checkProductByServer,
}
