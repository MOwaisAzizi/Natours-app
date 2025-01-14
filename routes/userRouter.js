const express = require('express')

const getAllUsers = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})
const createUser = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})
const getUser = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})
const updateUser = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})
const deleteUser = ((req, res)=>{
    res.status(500).json({
        message:'Error',
        status:'Not created yet',
    })
})

const router = express.Router()
router.route('').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router