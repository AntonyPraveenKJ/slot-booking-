const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const slotSchema=new Schema({
    slNo:{
        type:Number,
        required:true
    },
     booked:{
        type:Boolean,
        required:true
     }
})

module.exports=mongoose.model('Slot',slotSchema)