const express = require('express')
const {getTour, getOverview,getLoginForm,getAccount, updateUserData} = require('../controllers/viewController')
const { isLoggedIn, protect } = require('../controllers/authController')

const router = express.Router()

//isLoggedIn : using middlware for knowing if user is logged in or not to use it in header
//we do not use rout property because all out rout here is get 

router.get('/',isLoggedIn, getOverview)
router.get('/tour/:slug', isLoggedIn,getTour)
router.get('/login',isLoggedIn, getLoginForm)
//protecting users from seeing page of users
router.get('/me',protect ,getAccount)
router.post('/submit-user-data',protect, updateUserData)

module.exports = router
