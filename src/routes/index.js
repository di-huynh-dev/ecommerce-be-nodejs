'use strict'

const exppress = require('express')
const { apiKey, permission } = require('../auth/checkAuth')
const router = exppress.Router()

//Check apikey
router.use(apiKey)
//Check permission
router.use(permission('000'))

router.use('/v1/api/product', require('./product'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api', require('./access'))

module.exports = router
