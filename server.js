const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
    console.log('uncaughtException: server is shoting down...');
    console.log(err.name, err.message);
    process.exit(1)
})

dotenv.config({ path: './config.env' })
const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(() => console.log('successfully connected!'))

const port = process.env.PORT || 3000
const server = app.listen('0.0.0.0', () => {
    console.log(`App listening in port ${port}`);
})

process.on('unhandledRejection', err => {
    console.log('unhandledRejection: server is shoting down...');
    console.log(err.name, err.message);
    server.close(() => process.exit(1))
})

process.on('SIGABRT', ()=>{
    console.log('SIGABRT received. shut down the application');
    server.close(()=>{
        console.log('process terminated!');
    })
})