const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60*1000
    }
})
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = mailSender(email,"your 6-digit OTP is below",otp)
        console.log ("email response ", mailResponse)

    }
    catch(error){
        console.log ("email error ", error)
    }
}
otpSchema.pre("save",async function(next){
    //+
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    
    next();
})
module.exports = mongoose.model("OTP",otpSchema)
