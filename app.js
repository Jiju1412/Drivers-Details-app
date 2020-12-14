const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const mongoose = require("mongoose");


app.use(express.static("public"));

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.listen(2000,()=>{

    console.log("App is running at port 2000.....");
});

mongoose.connect("mongodb+srv://JijuMongoDB:Arathy@1412@jijumongodb.agqph.mongodb.net/driverDetailsDb?retryWrites=true&w=majority",{

    useNewUrlParser: true,
    useUnifiedTopology: true,

},(error)=>{

    if(error){
        console.log(error);
        console.log("Mongo DB is not connected!!..");
    } else{

        console.log("MongoDb connected successfully!..")
    }
});

const driverSchema = mongoose.Schema({

    driverId : Number,
    driverName : String,
    drivingRoute : String,
    visitMonth : String,
    visitCount : Number,
    salary : Number
});

const driver = mongoose.model("driver", driverSchema);

driver.create({

    driverId : 1001,
    driverName : "Tom",
    drivingRoute : "Toronto to Montreal",
    visitMonth : "December",
    visitCount : 23,
    salary : 60000

},(error,driverCreated)=>{

    if(error){
        console.log(error);
        console.log("Driver document is not created!!..");
    } else{

        console.log("Driver document is created as!.."+driverCreated)
    }
});


app.get("/all",(req,res)=>{

    driver.find({},(error,dataFound)=>{

        if(error){
            console.log(error);
            console.log("Data not retrieved from Mongo DB!!..");
        } 
        else{
    
            console.log("Data retrieved successfully as!.."+dataFound);

            res.render("display.ejs",{

                drivers : dataFound
            });
        }

    });
});


app.get("/delete/:id",(req,res)=>{

    const id = req.params.id;

    driver.findByIdAndDelete(id,(error, driverDeleted)=>{

        if(error){
            console.log(error);
            console.log("Driver details are not deleted!!..");
        } else{
    
            console.log("Driver details are deleted successfully as!..");
            console.log("deleted record is here = "+driverDeleted);

            res.redirect("/all");
        }
    });
});

app.get("/edit/:id",(req,res)=>{

    const id = req.params.id;

    driver.findById(id,(error,driverFound)=>{

        if(error){
            console.log(error);
            console.log("Driver details not found!!..");
        } else{
    
            console.log("Driver details found!.."+driverFound);
            
            res.render("edit.ejs",{

                drv : driverFound

            });
        }
    });
});

app.post("/update/:id",(req,res)=>{

    const id = req.params.id;

    const upd_drv = req.body;

    driver.findByIdAndUpdate(id,{

        driverId : upd_drv.driverId,
        driverName : upd_drv.driverName,
        drivingRoute : upd_drv.drivingRoute,
        visitMonth : upd_drv.visitMonth,
        visitCount : upd_drv.visitCount,
        salary : upd_drv.salary

    },(error,updDriver)=>{

        if(error){
            console.log(error);
            console.log("Driver detail is not updated!!..");
        } else{
    
            console.log("Driver document is updated successfully as!.."+updDriver);

            res.redirect("/all");
        }

    });

});

app.get("/add",(req,res)=>{

    res.render("add.ejs");
});

app.post("/add",(req,res)=>{

    const dr = req.body;

    driver.create({

        driverId : dr.driverId,
        driverName : dr.driverName,
        drivingRoute : dr.drivingRoute,
        visitMonth : dr.visitMonth,
        visitCount : dr.visitCount,
        salary : dr.salary

    },(error,drvCreated)=>{

        if(error){
            console.log(error);
            console.log("Driver record is not created!!..");
        } else{
    
            console.log("Driver record is created successfully as!.."+drvCreated);

            res.redirect("/all");
        }
    });
});