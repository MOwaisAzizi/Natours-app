const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please tell us your name!']
    },
    email:{
        type:String,
        required:[true,'Please provide your email!'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'Please provide a valid password'],
        minLength:8
    },
    passwordConfirm:{
        type:String,
        required:[true,'A confirm your password'],
        //works on create and save
        validate:{
            validator:function(val){
                return this.password === val
            }
        }
    },
})

userSchema.pre('save',async function(next){
    
    //if the password not changed 
    if(!this.isModified('password')) return next()

    //change password in hash(still is out password but assign it to crypt)
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined

    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User;