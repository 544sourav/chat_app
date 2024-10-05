const Chat = require("../models/Chat");
const User = require("../models/User");
const Request = require("../models/Request");
//const { emitevent } = require("../utils/features");
const {NEW_REQUEST,REFETCH_CHATS} = require("../constants/events");
const { emitEvent } = require("../utils/features");
exports.searchUser = async(req,res)=>{
    try{
        const { name = ''} = req.query;
        

        const myChats =  Chat.find({groupChat:false, members:req.user.id})
        //console.log('working',myChats)
        const allUsersFromMyChats = (await myChats).flatMap((chat) => chat.members);
        
        const allUsersExceptMeAndFriends = await User.find({
            _id: { $nin: allUsersFromMyChats },
            userName: { $regex: name, $options: "i" },
          });
          
        if (allUsersExceptMeAndFriends.length === 0) {
            return res.status(404).json({
                success: true,
                message: 'No users found matching the given name.',
                users: [], 
        });
        }
          const users = allUsersExceptMeAndFriends.map(({ _id, userName, profile }) => ({
            _id,
            userName,
            profile,
          }));
        
          return res.status(200).json({
            success: true,
            users,
          });
    }
    catch(error){
        console.log("error",error)
        return res.status(500).json({
            success:false,
            message:"server error",
            
        })
    }
}

exports.sendFrinedRequest = async(req,res)=>{
  try{
    const {userId} = req.body;
    console.log("user",userId)
    const request = await Request.findOne({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    });
    //console.count()

    if(request){
      return res.status(409).json({
        success:false,
        message:"request send all ready"

      })
    }
    //console.count()
    await Request.create({
      sender: req.user.id,
      receiver: userId,
    });
   // console.count()
    emitEvent(req, NEW_REQUEST, [userId])
    console.count()
    return res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  }
  catch(error){
    return res.status(500).json({
      success:false,
      message:"server error",
      error
    })
  }
}
exports.acceptFriendRequest = async(req,res)=>{
  try{
      const {requestId,accept}= req.body;
      const request = await Request.findById(requestId)
      .populate("sender", "userName")
      .populate("receiver", "userName");
    console.log("request",request);
      
    if(!request){
      return res.status(400).json({
        success:true,
        message:"request don't exist"
      })
    }
    if (request.receiver._id.toString() !== req.user.id.toString()){
      return res.status(403).json({
        success:true,
        message:"Your are not authorized to accept the request"
      })
    }
    if (!accept) {
      await request.deleteOne();
  
      return res.status(200).json({
        success: true,
        message: "Friend Request Rejected",
      });
    }
    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      Chat.create({
        members,
        chatName: `${request.sender.userName}-${request.receiver.userName}`,
        image:`https://api.dicebear.com/6.x/initials/svg?seed=${request.sender.userName}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: "Friend Request Accepted",
      senderId: request.sender._id,
    });
  }
  catch(error){
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Server error"
    })
  }
}
exports.getNotification = async(req,res)=>{
  try{
    const requests = await Request.find({ receiver: req.user.id }).populate(
      "sender",
      "userName profile"
    );
  
    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        userName: sender.userName,
        profile: sender.profile,
      },
    }))
    return res.status(200).json({
      success: true,
      allRequests,
    });
    
  }
  catch(error){
    console.log(error)
    return res.status(500).json({
      success:false,
      message:"Server error"
      
    })
  }
}