const express = require('express')
const { getAllUsers, createUser, getUser, updateUser, deleteUser,updateMe,deleteMe,getMe,resizeUserPhoto, uploadUserPhoto } = require('../controllers/userControllers')
const { signup,login,logout,forgotPassword,resetPassword, updatePassword,protect, restrictTo, } = require('../controllers/authController')

//using express class
const router = express.Router()

router.post('/signup',signup)
router.post('/login',login)

router.get('/logout',logout)

router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword/:token',resetPassword)

//after thid middleware all routupdateMyPasswords will protect
router.use(protect)

router.patch('/updateMyPassword',updatePassword)
router.patch('/updateMe',uploadUserPhoto,resizeUserPhoto, updateMe)
router.delete('/deleteMe',deleteMe)
router.get('/me',getMe,getUser)

//user shoud be an admin and protected
router.use(restrictTo('admin'))

router.route('').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router