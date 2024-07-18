'use strict'

const { BadRequestError } = require('../core/error.response')
const { product, clothing, electronic, furniture } = require('../models/product.model')
const { insertInventory } = require('../models/repositories/inventory.repo')
const {
  findAllDraftsForShop,
  publicProductById,
  findAllPublicsForShop,
  unPublicProductById,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require('../models/repositories/product.repo')
const { updateNestedObjectParser, removeUndefindObject } = require('../utils')

// Define factory class to create product

class ProductFactory {
  static productRegistry = {}

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError('Invalid product type')
    return new productClass(payload).createProduct()
  }

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new BadRequestError('Invalid product type')
    return new productClass(payload).updateProduct(product_id)
  }

  //GET
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true }
    return await findAllDraftsForShop({ query, limit, skip })
  }

  static async findAllPublicsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true }
    return await findAllPublicsForShop({ query, limit, skip })
  }

  // PUT
  static async publicProductByShop({ product_shop, product_id }) {
    return await publicProductById({ product_shop, product_id })
  }

  static async unPublicProductByShop({ product_shop, product_id }) {
    return await unPublicProductById({ product_shop, product_id })
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch })
  }

  static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_description'],
    })
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] })
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attribute,
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_price = product_price
    this.product_description = product_description
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attribute = product_attribute
  }

  // Create new product
  async createProduct(productId) {
    const newProduct = await product.create({ ...this, _id: productId })
    if (newProduct) {
      // Add product_stock in inventory collection
      await insertInventory(newProduct._id, newProduct.product_shop, newProduct.product_quantity)
    }

    return newProduct
  }

  // Update product
  async updateProduct(product_id, payload) {
    return await updateProductById({ product_id, payload, model: product })
  }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attribute,
      productShop: this.product_shop,
    })
    if (!newClothing) {
      throw new BadRequestError('Create new clothing failed')
    }

    const newProduct = await super.createProduct(newClothing._id)
    if (!newProduct) {
      throw new BadRequestError('Create new product failed')
    }
    return newProduct
  }

  async updateProduct(product_id) {
    /**
     * TODO: update product
     * 1. remove attribute has null or undefind
     * 2. check update chỗ nào
     * 3.
     */
    const objectParams = removeUndefindObject(this)

    if (objectParams.product_attribute) {
      await updateProductById({
        product_id,
        payload: updateNestedObjectParser(objectParams.product_attribute),
        model: clothing,
      })
    }

    const updateProduct = await super.updateProduct(product_id, updateNestedObjectParser(objectParams))
    return updateProduct
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attribute,
      productShop: this.product_shop,
    })
    if (!newElectronic) {
      throw new BadRequestError('Create new electronic failed')
    }

    const newProduct = await super.createProduct(newElectronic._id)
    if (!newProduct) {
      throw new BadRequestError('Create new product failed')
    }
    return newProduct
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attribute,
      productShop: this.product_shop,
    })
    if (!newFurniture) {
      throw new BadRequestError('Create new furniture failed')
    }

    const newProduct = await super.createProduct(newFurniture._id)
    if (!newProduct) {
      throw new BadRequestError('Create new product failed')
    }
    return newProduct
  }
}

//registẻ
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)
module.exports = ProductFactory
