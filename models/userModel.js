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
        minLength:8,
        //do not take the password to cliend
        select : false
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
    passwordChangedAt:Date
})


userSchema.pre('save',async function(next){
    
    //if the password not changed 
    if(!this.isModified('password')) return next()

    //change password in hash(still is out password but assign it to crypt)
    this.password = await bcrypt.hash(this.password,12)
    this.passwordConfirm = undefined
    next()
})

userSchema.methods.correctPassword = async function(condidatePassword,userPassword){
    //compare bcripted user password with changing user password to bcript and compare
    return await bcrypt.compare(condidatePassword,userPassword)
}

//in every document we access this methods
userSchema.methods.changePasswordAfter = function(JWTTimesTemp){
    //change milisedond the second
    const changeTimestemp = this.passwordChangedAt.getTime()/1000
    if(this.passwordChangedAt){
        //this means time of password changed in the future date
        return JWTTimesTemp < changeTimestemp
    }

    //this means password not changed
    return false
}


const User = mongoose.model('User', userSchema)
module.exports = User;