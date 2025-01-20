const Tour = require('../models/tourModel')

exports.getAllTours = async(req, res) => {
try{
    // const query = Tour.find().where('duration').equals(5).where('dificuly').equals('easy')
    // const tours = Tour.find({duration:20})  //  const tours = Tour.find(req.query)

    //1-BUILD QUERY
    const queryOBJ = {...req.query}

    //2A-filtering
    //we extract these queries form our filtering for better working with it
    const excludedField = ['sort','page','field','limit']
     excludedField.forEach(el=>delete queryOBJ[el])
     
    //2B-advence Filtering
     let queryStr = JSON.stringify(queryOBJ)
     //to add a doller sighn to our query in order to use it in mongoose
     queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, match=>`$${match}`)
    //  console.log(JSON.parse(queryStr));
     
     //we are doing this for chaining the prototype methods of find(by using directly await it is imposible becouse it compack with document using first method)
     let query = Tour.find(JSON.parse(queryStr))

     //3-sorting
    //  if(req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' ')
    //     console.log(sortBy);
    //     query = query.sort(sortBy)
    //  }else{
    //     query = query.sort('-createdAt')
    //  }

     //4-fields
     if(req.query.fields){
        const fields = req.query.fields.split(',').join(' ')
        query = query.select(fields)
     }

    const page = (req.query.page * 1) || 1;
    const limit = (req.query.limit * 1) || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    
    if (req.query.page) {
        const numTours = await Tour.countDocuments();
        if (skip >= numTours) throw new Error('This page does not exist');
    }
     
     const tours =  await query

     //SEND RESPOSE
    res.status(200).json({
        status: 'success',
        result: tours.lenght,
        data: {
            tours
        }
    })
}catch(err){
    res.status(404).json({
        status:'failed',
        message:'Not found!'
    })
}
}


exports.getTour = async(req, res) => {
    try{
        const tour = await Tour.findById(req.params.id)
        // const tour = await Tour.findOne({_id:req.parmas.id})
        //tour.save 
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        })
    }catch(err){
        res.status(404).json({
            status:'failed',
            message:'invalid Data!'
        })
    }
}

exports.createTour = async (req, res) => {
    try{
        // const Tour = new Tour({})
        // Tour.sava()     save is the prototye object of the dindone class
       const tour = await Tour.create(req.body)
       res.status(201).json({
        status:'success',
        data : {
            tour
        }
       })
    }catch(err){
        res.status(400).json({
            status:'failed',
            message:'invalid Data!'
        })
    }
    }

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message:  'Invalid Data!'
        });
    }
};


exports.deleteTour = async(req, res) => {
    try {

        //commonlly we do not return someting
     await Tour.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data:null
        });
    } catch (err) {
        res.status(404).json({
            status: 'failed',
            message: 'not found!'
        });
    }
}