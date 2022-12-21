const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const approveSchema= new Schema({
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
    companyname:{
        type:String,
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

module.exports=mongoose.model('Approved',approveSchema)