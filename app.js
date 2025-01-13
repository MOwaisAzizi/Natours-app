const fs = require('fs')
const express = require('express')
const app = express()

// //get is http method for request and the data is the respose from server
// app.get('/',(req,res)=>{
// //    res.status(200).send('Hello from Server!')
//    res.status(200).json({message:'Hello from server(get)',app:'natrouse'})
// })

// app.post('/',(req,res)=>{
//        res.status(200).send('you can post here(post)')
//     })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours',(req,res)=>{
   res.status(200).json({
       status:'success',
       result:tours.lenght,
    data:{
        tours
    }
   })
})

app.get('/api/v1/tours/:id',(req,res)=>{
    //to change id to number
    const id = req.params.id * 1
    const tour = tours.find(el=>el.id === id)
    // if(id > tours.length){
      if(!tour){
        return res.status(404).json({
            status:'Failed',
            message:'Not Found',
        })
    }

    res.status(200).json({
        status:'success',
     data:{
         tour
     }
    })
 })

//middle ware for posting to change the the json post to object and put it in req.body
app.use(express.json())
app.post('/api/v1/tours', (req,res)=>{
   console.log(req.body);
   const newId = tours[tours.length - 1].id + 1
   const newTour = Object.assign({id:newId},req.body)
   tours.push(newTour)
   fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,JSON.stringify(tours), err =>{
    // to send a message to client that this object is posted successfully
    res.status(201).json({
        status:'success',
        data:{
            tours:newTour
        }
    })
   })
})


const port = 3000
app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
})