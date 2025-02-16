const crypto = require('crypto')
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
    role:{
        type:String,
        default:'user',
        enum:['user','guide','lead-guide','admin']
    },
    password:{
        type:String,
        required:[true,'Please provide a valid password'],
        minLength:8,
        //do not send the password to cliend
        select : false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm your password(not confirm feild yet)'],
        //works on create and save
        validate:{
            validator:function(val){
                return this.password === val
            }
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default: true,
        select:false
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

userSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now()-1000;
    next();
  });

  userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };

//in every document we access this methods
userSchema.methods.changePasswordAfter = function(JWTTimesTemp){
    //change milisedond the second
    if(this.passwordChangedAt){
        const changeTimestemp = parseInt(this.passwordChangedAt.getTime()/1000,10)
        //this means time of password changed in the future date
        return JWTTimesTemp < changeTimestemp
    }
    //this means password not changed
    return false
}

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

//before geting users , bring user that is not inactive
userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}})
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User;