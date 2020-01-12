var express   = require("express");
var router    =express.Router();  //using Routers to send the routing data out
var Sight     =require("../models/sights");
var middleware = require("../middleware/index");



//Show all the sights
router.get("/",function(req,res){
    //Get all locations from db and showcase them
    Sight.find({},function(err,allSights){
        if(err){
            console.log(err);
        }else{
            res.render("sights/index",{sights:allSights});
        }
    });
   
});

//Posting sights into database
router.post("/",middleware.isLoggedIn,function(req,res){
    
     var name= req.body.name;
     var image = req.body.image;
     var description=req.body.description;
     var location   =req.body.location;
     var price      =req.body.price;
     var author     ={
         id: req.user._id,
         username:req.user.username
     };
     var newSight={name:name,image:image,description:description,author:author,location:location,price:price};
     Sight.create(newSight,function(err,found){
         if(err){
             console.log("Error in the post!");
         }else{
            //This is another way of doing the thing
            //  found.author.id=req.user._id;
            //  found.author.username=req.user.username;
            //  found.save();
             console.log("Posted!");
             res.redirect("/sights");
         }
     });
});

// Show new form
router.get("/new",middleware.isLoggedIn,function(req,res){
   res.render("sights/new");
});

//Show comments

router.get("/:id",function(req,res){
    Sight.findById(req.params.id).populate("comments").exec(function(err,foundsight){
       if(err){
        //   console.log("There is an error");
          console.log(err);
       }else{
        //   console.log("Comment in found Sight="+foundsight.comments);
           res.render("sights/show",{sight:foundsight,currentUser:req.user});
       }
    })
});

//EDIT
router.get("/:id/edit",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
    
    var val=req.params.id;
            Sight.findById(val,function(err,found){
      if(err){
          console.log(err)
      }else{
         var data={
        author:found.name,
        image:found.image,
        description:found.description,
        id:found._id,
        location:found.location,
        price   :found.price
        
    };
         res.render("sights/edit",{data:data});
      }
    });
   
});

router.put("/:id",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
    Sight.findByIdAndUpdate(req.params.id,req.body.sights,function(err,found){
        if(err){
            console.log("Error in the update")
            res.redirect("/sights");
        }else{
            // console.log("The body="+req.body.sights);
            // console.log("Edited="+found);
            res.redirect("/sights/"+req.params.id);
        }
    })
})
//DELETE

router.delete("/:id",[middleware.isLoggedIn,middleware.checkUser],function(req,res){
   Sight.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log("Error in Deleting!");
            res.redirect("/sights/"+req.params.id);
                }else{
            res.redirect("/sights");
             }
    })
});

//middleware in middleware directory

module.exports=router;