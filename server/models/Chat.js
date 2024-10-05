const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    chatName:{
        type:String,
        required:true
    },
    groupChat:{
        type:Boolean,
        default:false
    },
    image:{
        type:String,
    },
    creator:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    members:[{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }]
},{
    timestamps:true,
})

module.exports = mongoose.model('Chat',chatSchema)