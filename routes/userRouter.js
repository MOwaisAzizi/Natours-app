const express = require('express')
const { getAllUsers, createUser, getUser, updateUser, deleteUser,login } = require('../controllers/userControllers')
const { signup } = require('../controllers/authController')

//using express class
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)

router.route('').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router