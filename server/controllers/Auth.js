const OTP = require("../models/OTP")
const User = require("../models/User")
const otpGenerator = require("otp-generator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");

//otp
exports.sendOtp=async(req,res)=>{

    try{
        const {email} = req.body
        //console.log("email",email)
        const existingUser = await User.findOne({email})

        if(existingUser){
           return res.status(401).json({
                success:false,
                message:"user already exist"
           })
        }
        var otp =  otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        let result = OTP.findOne({otp:otp})

        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
         result = await OTP.findOne({otp:otp});
        }

        const payload = {otp,email}

        const otpBody = await OTP.create(payload)
        console.log("otpBody",otpBody)

        return res.status(200).json({
            success:true,
            message:"otp send successfully",
            otp
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }

}
//signup
exports.signup = async(req,res) =>{
    //fetch data 
    try{
        const {
            fullName,
            userName,
            email,
            password,
            confirmPassword,
            otp
        } = req.body;
        //validate
        if(!fullName ||!userName || !email || !password ||!confirmPassword  || !otp){
            return res.status(403).json({
                success:false,
                message:"all fields are required"
            })
        }
    
        //password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:'password and confirm pass do not match'
            })
        }
        // user exist
    
        const existingUser = await User.findOne({email})
    
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'user is already  registered'
            })
        }
    
        //find most resent otp
    
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("recentOtp",recentOtp)
    
        //validate otp
        if(recentOtp.length === 0 ){
            //otp not found
            return res.status(400).json({
                success:false,
                message:'otp not found'
            })
        }
        //###### check ######## array
        else if (otp !== recentOtp[0].otp){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:'invalid otp'
            })
    
        }
        //hash password
       const hashedPassword = await bcrypt.hash(password, 10)
    
       //entry created
       const user = await User.create({
        fullName,
        userName,
        email,
        password:hashedPassword,
        profile:`https://api.dicebear.com/6.x/initials/svg?seed=${userName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`
       })

       return res.status(200).json({
        success:true,
        message:"user registered successfully",
        user,
       })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "server issue try again later "
        })

    }
}
//login
exports.login = async(req,res)=>{

    try{
        //fetch data 
        const {
            email,
            password,
        }= req.body;
       // console.log("email",email)
       // console.log("password",password)

        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"all field required"
            })
        }
        const user = await User.findOne({email}).select("+password")
        //console.log("user",user.password)

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid credentials"
            })
        }
        //generate token
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id: user._id,
                userName:user.userName,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET,{
                expiresIn:"24h"
            });
            user.token = token;
            user.password = undefined;

             //create cookie

            const options= {
                expires: new Date(Date.now() + 24*60*60*1000),
                httpOnly:true,
                sameSite: 'None',  
                secure: true 
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'logged in successfully'
            })
        }
        else {
            return res.status(401).json({
                success:false,
                message:'password is incorrect'
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'server error login fail'
        })

    }

}
exports.checkUserName = async(req,res)=>{
    const { userName } = req.body;

    try {
      const user = await User.findOne({ userName: userName });
  
      if (user) {
        return res.json({ 
            success:true,
            isAvailable: 'no' });
      } else {
        return res.json({ 
            success:true,
            isAvailable: 'yes' });
      }
    } catch (error) {
      console.error('Error checking username:', error);
      res.status(500).json({
        success:false,
        message: 'Server error' });
    }
  
}
exports.getMyProfile = async(req,res)=>{
    try{
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({
                success:false,
                message:"NO user Found"
            })
        }
        return res.status(200).json({
            success: true,
            user,

    })}
    catch(error){
        return res.status(404).json({
            success:false,
            message:"server error"
        })
    }
}