const express = require('express')
const {getTour, getOverview} = require('../controllers/viewController')

const router = express.Router()

//we do not use rout property because all out rout here is get 
router.get('/',getOverview)
router.get('/tour',getTour)

module.exports = router
