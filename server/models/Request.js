const mongoose = require("mongoose")

const reqSchema = new mongoose.Schema({
        status:{
            type:String,
            default:"pending",
            enum:["pending","accepted","rejected"]
        },
        sender:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true
        },
        receiver:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true
        },
},{
    timestamps:true,
})

module.exports = mongoose.model('Request',reqSchema)