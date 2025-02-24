const express = require('express')
const {getTour, getOverview,getLoginForm} = require('../controllers/viewController')
const { isLoggedIn } = require('../controllers/authController')

const router = express.Router()

//using middlware for knowing if user is logged in or not to use it in header
router.use(isLoggedIn)
//we do not use rout property because all out rout here is get 
router.get('/',getOverview)
router.get('/tour/:slug',getTour)
router.get('/login',getLoginForm)

module.exports = router
