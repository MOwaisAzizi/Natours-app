const express = require('express')

const app = express()
const morgan = require('morgan')
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')

//this is for just shoing the morgan(to show some states of requst like request or success.....) whin the app is runing
if(process.env.NODE_ENV === 'development') app.use(morgan('dev'))

//after execution this middleware end the responing
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// whin no url match to top routes this middlware will run and send back a message for all wrong urls
// app.all('*',(req,res,next)=>{
//     res.status(404).json({
//         status:'fail',
//         message:`not fount ${req.originalUrl} in this sever!`
//     }) 
// })

app.all('*',(req,res,next)=>{
  const err = new Error(`not fount ${req.originalUrl} in this sever!`)
  
})

//whin we write a middleware that has four arguments that means that is an error handling middlwware not regular one
 app.use((err,req,res,next)=>{
    err.status = err.status || 500
    err.statusCode = err.statusCode || 'error'

    res.status(err.statusCode).json({
       status:err.status,
       message:err.message,
    })

 })

module.exports = app

