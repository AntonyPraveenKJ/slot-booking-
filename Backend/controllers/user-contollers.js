const User=require('../models/user');
const FormData=require('../models/regForm');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const Booked=require('../models/booked');
const {ObjectId}=require('mongodb');
var objectId=require('mongodb').ObjectId


//user signup

const signup=async(req,res,next)=>{
    const {fname,lname,email,password} = req.body;
    let existingUser;

    try{
        existingUser=await User.findOne({email:email})
    }catch(err){
        console.log(err)
    }

    if(existingUser){
        return res.status(400).json({
            message:"User Already Exist!!"
        })
    }

    const hashedPassword=bcrypt.hashSync(password)
    const user=new User({
        fname,
        lname,
        email,
        password:hashedPassword
    })

    try{
        await user.save()
    }catch(err){
console.log(err)
    }

    return res.status(201).json({message:user})
};

//user login

const login=async (req,res,next)=>{
    const {email,password}=req.body;
    let existingUser;

    try{
        existingUser=await User.findOne({email:email})
    }catch(err){
        return new Error(err)
    }

    if(!existingUser){
        return res.status(400).json({message:"User not found!! You need to Signup!!"})
    }

    const isPasswordCorrect= bcrypt.compareSync(password,existingUser.password)

    if(!isPasswordCorrect){
        return res.status(400).json({message:"Invalid Email or Password!!!"})
    }

    const token=jwt.sign({id:existingUser.id},process.env.JWT_SECRET_KEY,{expiresIn:"35s"})

    console.log("Generated Token\n",token)

    if(req.cookies[`${existingUser._id}`]){
        req.cookies[`${existingUser._id}`]=""
    }

    res.cookie(String(existingUser._id),token,{
        path:'/',
        expires:new Date(Date.now()+1000*30),
        httpOnly:true,
        sameSite:"lax"
    })
      
    return res.status(200).json({message:"Successfully LoggedIn",user:existingUser,token})
};

//verify token

const verifyToken=(req,res,next)=>{
    const cookies=req.headers.cookie;
    const token=cookies.split("=")[1];
    console.log(token)

    if(!token){
        res.status(404).json({message:"No token found"})
    }
    jwt.verify(String(token),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
          return res.status(400).json({message:"Invalid token"})
        }
        console.log(user.id);
        req.id=user.id
    })
    next()
};


const getUser=async (req,res,next)=>{
    const userId=req.id;
    let user;

    try{
        user=await User.findById(userId,"-password")
    }catch(err){
        return new Error(err)
    }
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json({user})
};

const refreshToken=(req,res,next)=>{
    const cookies=req.headers.cookie;
    const prevToken=cookies.split('=')[1];

    if(!prevToken){
        return res.status(400).json({message:"Couldn't find token"})
    }
    jwt.verify(String(prevToken),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:"Authentication Failed"})
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`]="";

        const token=jwt.sign({id:user.id},process.env.JWT_SECRET_KEY,{
            expiresIn:'35s'
        })

        console.log("Regenerated Token\n",token);

        res.cookie(String(user.id),token,{
            path:'/',
            expires:new Date(Date.now()+1000*30),
            httpOnly:true,
            sameSite:"lax"
        });

        req.id=user.id;
        next();
    })
};

const logout=(req,res,next)=>{
    const cookies=req.headers.cookie;
    const prevToken=cookies.split('=')[1];

    if(!prevToken){
        return res.status(400).json({message:"Couldn't find token"});
    }
    jwt.verify(String(prevToken),process.env.JWT_SECRET_KEY,(err,user)=>{
        if(err){
            console.log(err);
            return res.status(403).json({message:'Authentication Failed'});
        }
        res.clearCookie(`${user.id}`);
        req.cookies[`${user.id}`]="";
        return res.status(200).json({message:"Successfully loggedOut"})
    })
};



//Uploading registeration details into database

const formdata=async(req,res,next)=>{
      const{name,address,city,state,email,phno,companyname,description}=req.body;

      const regData=new FormData({
           name,
           address,
           city,
           state,
           email,
           phno,
           companyname,
           description,
           status:"pending"
      })

      try{
        await regData.save()
      }catch(err){
        console.log(err)
      }

      return res.status(200).json({message:"Successfully Stored to database!!"})
};

//getting booked details

const getBookedDetails=async(req,res,next)=>{
    let bookedData;
    try{
       bookedData= await Booked.find()
    }catch(err){
        console.log(err)
    }

    return res.status(200).json({message:bookedData})
};

//get data from booked

const showBooked=async(req,res,next)=>{
    const id=req.params.id;
    let dataExist;
    try{
      dataExist=await Booked.findOne({_id:objectId(id)})
    }catch(err){
        console.log(err)
    }

    if(dataExist){
        return res.status(200).json({message:dataExist})
    }
    return res.status(400).json({message:"Data did not exist!!"})
};



exports.signup=signup;
exports.login=login;
exports.verifyToken=verifyToken;
exports.getUser=getUser;
exports.refreshToken=refreshToken;
exports.logout=logout;
exports.formdata=formdata;
exports.getBookedDetails=getBookedDetails;
exports.showBooked=showBooked;


