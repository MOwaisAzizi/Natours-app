const express = require('express')
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/userControllers')

//using express class
const router = express.Router()
router.route('').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router