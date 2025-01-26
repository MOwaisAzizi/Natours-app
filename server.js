const dotenv = require('dotenv')

dotenv.config({path:'./config.env'})
const mongoose = require('mongoose')
const app = require('./app')

const DB = process.env.DAtABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:true,
    useUnifiedTopology:true
}).then(()=>console.log('successfully connected')).catch(err=>{
    console.log('errr ❌😂',err);
})


const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`App listening port ${port}`);
})

//     const testTour = new Tour({
//     name:'Forest in the mountin',
//     price:500
// })

// testTour.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log('ERROR😂',err);
// })

//reading environment varibles,//node uses many envirnment
// console.log(process.env.NODE_ENV);

//express environment
// console.log(app.get('env'));
//some