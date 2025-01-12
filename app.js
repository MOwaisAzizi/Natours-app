const express = require('express')
const app = express()

//get is http method for request and the data is the respose from server
app.get('/',(req,res)=>{
//    res.status(200).send('Hello from Server!')
   res.status(200).json({message:'Hello from server(get)',app:'natrouse'})
})

app.post('/',(req,res)=>{
       res.status(200).send('you can post here(post)')
    })

const port = 3000
app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})