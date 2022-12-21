const express=require('express');
const mongoose=require('mongoose');
const userRouter=require('./Routes/user-routes');
const adminRouter=require('./Routes/admin-routes');
const cookieParser=require('cookie-parser');
const cors=require('cors');
require('dotenv').config();
const app=express();

//Middleware

app.use(cors({credentials:true, origin:"http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());
app.use('/api',userRouter);
app.use('/adminRoute',adminRouter);

//Database Connection

mongoose.connect('mongodb://localhost:27017/booking_slot').then(()=>{
  app.listen(5000)
  console.log("Database Connected!! Listening to port 5000")
}).catch((err)=>console.log(err))



