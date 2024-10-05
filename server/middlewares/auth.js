const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { TOKEN } = require("../constants/config");
const { parse } = require('cookie')

exports.auth = async(req,res,next)=>{
    try{
        //extract the token
        const  token = req.cookies.token || req.body.token|| req.header("Authorization").replace("Bearer ","");

        if(!token){
            return res.status(400).json({
                success:false,
                message:'token is missing'
            })
        }

        //verify the  token
        try{
            const decode = await jwt.verify(token,process.env.JWT_SECRET)
            //console.log(decode);
            req.user = decode;

        }
       catch(err){
            return res.status(401).json({
                success:false,
                message:"Session expired login again"
            });
           
       }
       next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"some thing went wrong while token validation"
        })

    }
}


exports.socketAuthenticator = async (err, socket, next) => {
  try {
    
    const cookieHeader = socket.request.headers.cookie || '';
    console.log('Cookie Header:', socket.request._query);

    
    const cookies =  parse(cookieHeader);
    console.log('Parsed Cookies:', cookies);

    
    const token = socket.request._query.token||cookies.token ;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    // Verify the token
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded User:', decodedUser);

    
    socket.user = decodedUser;

    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    next(new Error('Authentication error: Invalid token'));
  }
};








//module.exports = { socketAuthenticator };
