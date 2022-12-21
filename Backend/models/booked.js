const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const bookedSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phno:{
        type:String,
        required:true
    },
    company:{
        type:String,
        required:true
    },
    slot:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String
    }
})


module.exports=mongoose.model('Booked',bookedSchema)