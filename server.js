const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
const app = require('./app')
const { Mongoose } = require('mongoose')

//reading environment varibles,//node uses many envirnment
// console.log(process.env.NODE_ENV);

//express environment
// console.log(app.get('env'));

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD)
Mongoose.concat(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
}).then(()=>console.log('successfully connected'))


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})