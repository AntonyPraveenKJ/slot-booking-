const Admin=require('../models/admin');
const Slot=require('../models/slot');
const Booked=require('../models/booked')
const ProcessData=require('../models/processed');
const ApproveData=require('../models/approved')
const RegData=require('../models/regForm')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {ObjectId}=require('mongodb');
var objectId=require('mongodb').ObjectId


//user signup

// const AdminSignup=async(req,res,next)=>{
//     const {email,password} = req.body;
//     let existingAdmin;

//     try{
//         existingAdmin=await Admin.findOne({email:email})
//     }catch(err){
//         console.log(err)
//     }

//     if(existingAdmin){
//         return res.status(400).json({
//             message:"Admin Already Exist!!"
//         })
//     }

//     const hashedPassword=bcrypt.hashSync(password)
//     const admin=new Admin({
//         email,
//         password:hashedPassword
//     })

//     try{
//         await admin.save()
//     }catch(err){
// console.log(err)
//     }

//     return res.status(201).json({message:admin})
// };

//admin login

const AdminLogin=async (req,res,next)=>{
    const {email,password}=req.body;
    let existingAdmin;

    try{
        existingAdmin=await Admin.findOne({email:email})
    }catch(err){
        return new Error(err)
    }

    if(!existingAdmin){
        return res.status(400).json({message:"Admin not found!!"})
    }

    const isPasswordCorrect= bcrypt.compareSync(password,existingAdmin.password)

    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Email or Password!!!"})
    }

    const token=jwt.sign({id:existingAdmin.id},process.env.JWT_SECRET_KEY,{expiresIn:"1hr"})

    console.log("Generated Token\n",token)

    if(req.cookies[`${existingAdmin._id}`]){
        req.cookies[`${existingAdmin._id}`]=""
    }

    res.cookie(String(existingAdmin._id),token,{
        path:'/',
        expires:new Date(Date.now()+1000*30),
        httpOnly:true,
        sameSite:"lax"
    })
      
    return res.status(200).json({message:"Successfully LoggedIn",admin:existingAdmin,token})
};

//verify token

const verifyAdminToken=(req,res,next)=>{
    const cookies=req.headers.cookie;
    const token=cookies.split("=")[1];
    console.log(token)

    if(!token){
        res.status(404).json({message:"No token found"})
    }
    jwt.verify(String(token),process.env.JWT_SECRET_KEY,(err,admin)=>{
        if(err){
          return res.status(400).json({message:"Invalid token"})
        }
        console.log(admin.id);
        req.id=admin.id
    })
    next()
};


const getAdmin=async (req,res,next)=>{
    const adminId=req.id;
    let admin;

    try{
        admin=await Admin.findById(adminId,"-password")
    }catch(err){
        return new Error(err)
    }
    if(!admin){
        return res.status(404).json({message:"admin not found"})
    }
    return res.status(200).json({admin})
};

const refreshAdminToken=(req,res,next)=>{
    const cookies=req.headers.cookie;
    const prevToken=cookies.split('=')[1];

    if(!prevToken){
        return res.status(400).json({message:"Couldn't find token"})
    }
    jwt.verify(String(prevToken),process.env.JWT_SECRET_KEY,(err,admin)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:"Authentication Failed"})
        }
        res.clearCookie(`${admin.id}`);
        req.cookies[`${admin.id}`]="";

        const token=jwt.sign({id:admin.id},process.env.JWT_SECRET_KEY,{
            expiresIn:'35s'
        })

        console.log("Regenerated Token\n",token);

        res.cookie(String(admin.id),token,{
            path:'/',
            expires:new Date(Date.now()+1000*30),
            httpOnly:true,
            sameSite:"lax"
        });

        req.id=admin.id;
        next();
    })
};

const adminLogout=(req,res,next)=>{
    const cookies=req.headers.cookie;
    const prevToken=cookies.split('=')[1];

    if(!prevToken){
        return res.status(400).json({message:"Couldn't find token"});
    }
    jwt.verify(String(prevToken),process.env.JWT_SECRET_KEY,(err,admin)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:'Authentication Failed'});
        }
        res.clearCookie(`${admin.id}`);
        req.cookies[`${admin.id}`]="";
        return res.status(200).json({message:"Successfully loggedOut"})
    })
};

//get datails of new applicant to table

const getRegData=async(req,res,next)=>{
    let regData;
    try{
     regData = await RegData.find();
    }catch(err){
        return new Error(err)
    }
  if(regData){
    return res.status(200).json({message:regData})
  }
  return res.status(400).json({message:"No data found!!"})
};


//get the details of a specific data

const showData=async(req,res,next)=>{
    const id=req.params.id;
    let dataExist;
    try{
      dataExist=await RegData.findOne({_id:objectId(id)})
    }catch(err){
        console.log(err)
    }

    if(dataExist){
        return res.status(200).json({message:dataExist})
    }
    return res.status(400).json({message:"Data did not exist!!"})
};

//approve the selected data

const processData=async(req,res,next)=>{
    const id=req.params.id;
    let dataExist;
    try{
      dataExist=await RegData.findOne({_id:objectId(id)})
    }catch(err){
        console.log(err)
    }

    

    if(!dataExist){
        return res.status(400).json({message:"passing data failed!!"})
    }
 
        const processData=new ProcessData({
            name:dataExist.name,
            address:dataExist.address,
            city:dataExist.city,
            state:dataExist.state,
            email:dataExist.email,
            phno:dataExist.phno,
            companyname:dataExist.companyname,
            description:dataExist.description,
            status:"Processed"
        })


         try{
            await processData.save()
           }catch(err){
            console.log(err)
         }
         
         await RegData.deleteOne({_id:objectId(id)})
         return res.status(201).json({message:processData})

};


//for getting the data for processing

const processing=async(req,res,next)=>{
    let anyData;
    try{
      anyData=await ProcessData.find({status:{$nin:["Declined"]}})
    }catch(err){
        console.log(err)
    }
    if(anyData){
        return res.status(200).json({message:anyData})
    }
    return res.status(400).json({message:"No data Found!!" })
};

//show the data in a modal in pocessing section

const showDetailedData=async(req,res,next)=>{
    const id=req.params.id;
    let dataExist;
    try{
      dataExist=await ProcessData.findOne({_id:objectId(id)})
    }catch(err){
        console.log(err)
    }

    if(dataExist){
        return res.status(200).json({message:dataExist})
    }
    return res.status(400).json({message:"Data did not exist!!"})
};

//approve the data

const approveData=async(req,res,next)=>{
    const id=req.params.id;
    let anyProData;
    try{
      anyProData=await ProcessData.findOne({_id:objectId(id)})
    }catch(err){
        console.log(err)
    }

    

    if(!anyProData){
        return res.status(400).json({message:"passing data failed!!"})
    }

        const approveData=new ApproveData({
            name:anyProData.name,
            address:anyProData.address,
            city:anyProData.city,
            state:anyProData.state,
            email:anyProData.email,
            phno:anyProData.phno,
            companyname:anyProData.companyname,
            description:anyProData.description,
            status:"Approved"
        })


         try{
            await approveData.save()
           }catch(err){
            console.log(err)
         }
         
         await ProcessData.deleteOne({_id:objectId(id)})
         return res.status(201).json({message:approveData})


};


//to get approved data

const getApprovedData=async(req,res,next)=>{
    let anyData;
    try{
      anyData=await ApproveData.find()
    }catch(err){
        console.log(err)
    }
    if(anyData){
        return res.status(200).json({message:anyData})
    }
    return res.status(400).json({message:"No data Found!!" })
};

//show approved details modal view


const showApprovedData=async(req,res,next)=>{
    const id=req.params.id;
    let dataExist;
    try{
      dataExist=await ApproveData.findOne({_id:objectId(id)})
    }catch(err){
        console.log(err)
    }

    if(dataExist){
        return res.status(200).json({message:dataExist})
    }
    return res.status(400).json({message:"Data did not exist!!"})
};

//to decline data

const declineData=async(req,res,next)=>{
    const id=req.params.id;
    let dataExist;

    try{
        dataExist=await ProcessData.findOne({_id:objectId(id)})
    }catch(err){
        console.log(err)
    }

    if(dataExist){
        await ProcessData.updateOne({_id:objectId(id)},{$set:{status:"Declined"}})
        return res.status(200).json({message:"Data declined!!"})
    }
    return res.status(400).json({message:"Declined failed"})
};


// Get no. of slot available

const getSlot=async(req,res,next)=>{
    try{
     let anySlot= await Slot.find()
      return res.status(200).json({message:anySlot})
    }catch(err){
        console.log(err)
        return res.status(400).json({message:"Failed to pass slot!!"})
    }
};

//storing details for booking

const postBooked=async(req,res,next)=>{
    const slot=req.body.slot;
    const company=req.body.company;
  console.log(slot,'selected slot')
  console.log(company,'selected company')
console.log(req.body,'hgfgfjhgfh')
    let anyBooked;
    let getData;

    try{
        getData=await ApproveData.findOne({companyname:company})
    }catch(err){
       console.log(err)
    }

    try{
        anyBooked= await Booked.findOne({slot:slot})
    }catch(err){
        console.log(err)
    }

    if(anyBooked){
        return res.status(400).json({message:"Slot already booked"})
    }

    const slotBooked=new Booked({
        name:getData.name,
        address:getData.address,
        city:getData.city,
        state:getData.state,
        email:getData.email,
        phno:getData.phno,
        company:company,
        slot:slot,
        description:getData.description,
        status:"Booked"
    });

    try{
        await slotBooked.save()
    }catch(err){
        console.log(err)
    }

    await Slot.updateOne({slNo:slot},{$set:{booked:true}});
    await ApproveData.deleteOne({companyname:company})

    return res.status(200).json({message:"Slot Booked Successfully!!",slotBooked})

};

//getting only true data from slot

const getTrue=async(req,res,next)=>{
    let trueData;
    try{
        trueData=await Slot.find({booked:true},{slNo:1,_id:0})
        console.log(trueData);
    }catch(err){
        console.log(err)
    }

    return res.status(200).json({message:trueData})
}



//exports.AdminSignup=AdminSignup;
exports.AdminLogin=AdminLogin;
exports.verifyAdminToken=verifyAdminToken;
exports.getAdmin=getAdmin;
exports.refreshAdminToken=refreshAdminToken;
exports.adminLogout=adminLogout;
exports.getRegData=getRegData;
exports.showData=showData;
exports.processData=processData;
exports.processing=processing;
exports.showDetailedData=showDetailedData;
exports.approveData=approveData;
exports.getApprovedData= getApprovedData;
exports.showApprovedData=showApprovedData;
exports.declineData=declineData;
exports.getSlot=getSlot;
exports.postBooked=postBooked;
exports.getTrue=getTrue;