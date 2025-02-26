const Tour = require("../models/tourModel")
const AppError = require("../utiles/appError")
const catchAsync = require("../utiles/catchAsync")

exports.getOverview = catchAsync(async (req,res)=>{
  //1 get data from collection
    const tours = await Tour.find()
    
    //2-build templet
    //3-render the templet
    //render for showing html (looking for base in views). overview:lokking in veiw folder
    res.status(200).render('overview',{
      //local vars in base file
        title:'All Tours',
         tours
    })

  })

  exports.getTour = catchAsync(async(req,res,next)=>{
    //get data from requested tour including(guides and reveiws)
    const tour = await Tour.findOne({slug:req.params.slug}).populate({path:'reviews',fields:'review user rating'})
    if(!tour) {
      return next(new AppError('Thare is no tour with that error', 404))
    }
    
    //2-build templete
    //2-render ti
    
    res.status(200).render('tour',{
      title : `${tour.name} tour`,
      tour
    })
  })

  exports.getLoginForm = catchAsync( async(req,res,next)=>{
    res.status(200).render('login',{
       title:'Login to Your Account'
    })
  })

  exports.getAccount = catchAsync(async(req,res)=>{
    res.status(200).render('account',{
       title:'Your Account'
    })
  })

  exports.updateUserData = catchAsync(async(req,res)=>{
   console.log(req.body);
   
  })
  