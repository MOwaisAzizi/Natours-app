const express = require('express')
const { protect } = require('../controllers/authController')
const { getCheckoutSession } = require('../controllers/BookingController')

const router = express.Router()

router.get('/checkout/:tourId', protect, getCheckoutSession)

module.exports = router
