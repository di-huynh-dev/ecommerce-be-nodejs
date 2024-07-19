'use strict'

const { unGetSelectData } = require('../../utils')

const findAllDiscountCodesUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect, model }) => {
  const skipt = (page - 1) * limit

  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const discounts = await model
    .find(filter)
    .sort(sortBy)
    .skip(skipt)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()

  return discounts
}

const findAllDiscountCodesSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, select, model }) => {
  const skipt = (page - 1) * limit

  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
  const discounts = await model.find(filter).sort(sortBy).skip(skipt).limit(limit).select(select).lean()

  return discounts
}

const checkDiscountExists = async ({ filter, model }) => {
  return await model.findOne(filter).lean()
}

module.exports = { checkDiscountExists, findAllDiscountCodesUnSelect, findAllDiscountCodesSelect }
