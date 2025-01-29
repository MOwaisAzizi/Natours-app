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
}).then(()=>console.log('successfully connected'))


const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`App listening port ${port}`);
})

//every unhandlerd asyc rejection or error(like DB problem with connection) will come to this middleware
process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('thare is a broblem. server is shoting down...');
    server.close(()=>{
        server.exit(1)
    })
})


//     const testTour = new Tour({
//     name:'Forest in the mountin',
//     price:500
// })

// testTour.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log('ERROR',err);
// })

//reading environment varibles,//node uses many envirnment
// console.log(process.env.NODE_ENV);

//express environment
// console.log(app.get('env'));