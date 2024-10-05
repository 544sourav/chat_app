const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    userName:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    profile:{
        type:String,
        required:true
    }
    // avatar:{
    //     public_id:{
    //         type:String,
    //        // required:true,
    //     },
    //     url:{
    //         type:String,
    //         //required:true,
    //     }
    // }
   
},
{
    timestamps:true
})

module.exports = mongoose.model("User",userSchema)