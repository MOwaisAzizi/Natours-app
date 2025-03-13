const express = require('express')
const { getAllUsers, createUser, getUser, updateUser, deleteUser, updateMe, deleteMe, getMe, resizeUserPhoto, uploadUserPhoto } = require('../controllers/userControllers')
const { signup, login, logout, forgotPassword, resetPassword, updatePassword, protect, restrictTo, } = require('../controllers/authController')

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)

router.get('/logout', logout)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

router.use(protect)

router.patch('/updateMyPassword', updatePassword)
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe)
router.delete('/deleteMe', deleteMe)
router.get('/me', getMe, getUser)

router.use(restrictTo('admin'))

router.route('').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router