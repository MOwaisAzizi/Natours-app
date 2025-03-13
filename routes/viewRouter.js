const express = require('express')
const { getTour, getOverview, getLoginForm, getAccount } = require('../controllers/viewController')
const { isLoggedIn, protect } = require('../controllers/authController')
const { createBookingCheckout, getMyTour } = require('../controllers/BookingController')

const router = express.Router()

router.get('/', createBookingCheckout, isLoggedIn, getOverview)
router.get('/tour/:slug', isLoggedIn, getTour)
router.get('/login', isLoggedIn, getLoginForm)

router.get('/me', protect, getAccount)
router.get('/my-tours', protect, getMyTour)

module.exports = router
