const Tour = require("../models/tourModel")
const catchAsync = require("../utiles/catchAsync")

exports.getOverview = catchAsync(async (req,res)=>{
  //1 get data from collection
  console.log('finding');
    const tours = await Tour.find()
    
    console.log(tours);
    
    //2-build templet
    //3-render the templet
    //render for showing html (looking for base in views)
    res.status(200).render('overview',{
      //local vars in base file
        title:'All Tours',
         tours
    })

  })

  exports.getTour = catchAsync(async(req,res)=>{
    //get data from requested tour including(guides and reveiws)
    const tour = await Tour.findOne({slug:req.params.slug}).populate({path:'reviews',fields:'review user rating'})
    //2-build templete
    //2-render ti
    res.status(200).render('tour',{
      title : 'tour',
      tour
    })
  })