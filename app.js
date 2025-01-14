const express = require('express')
const morgan = require('morgan')
const app = express()
const userRouter = require('./routes/userRouter')
const tourRouter = require('./routes/tourRouter')

app.use(express.json())
app.use(morgan('dev'))

app.use((req,res,next)=>{
    console.log('Hello rom Middlewarfe');
    next()
})

app.use((req,res,next)=>{
    req.requestTime = new Date();
    next();
  });


app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)

//start server
const port = 3000
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})