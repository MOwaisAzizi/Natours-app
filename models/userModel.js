const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:'string',
        required:[true,'A user should hava a name']
    },
    email:{
        type:'email',
        // required:[true,'A user should hava a name']
    },
    photo:{
        type:'string',
        required:[true,'A user should hava a photo']
    },
    password:{
        type:'number',
        required:[true,'A user should hava a password']
    },
    confirm:{
        type:'number',
        required:[true,'A user should confirm a the password']
    },
})

const User = mongoose.model('User',userSchema)
module.exports = User;