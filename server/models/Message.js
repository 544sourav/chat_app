const mongoose = require("mongoose")

const mesgSchema = new mongoose.Schema({
        sender:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true
        },
        chat:{
            type:mongoose.Types.ObjectId,
            ref:"Chats",
            required:true
        },
        content: String,
        file:String,
        // attachments:[
        //     {
        //     public_id:{
        //         type:String,
        //         required:true,
        //     },
        //     url:{
        //         type:String,
        //         required:true,
        //     }}
        // ]

},
{
    timestamps:true
})

module.exports = mongoose.model('Message',mesgSchema)