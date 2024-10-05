const { ALERT, REFETCH_CHATS } = require('../constants/events');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const { emitEvent } = require('../utils/features');

exports.newGroupChat=async(req,res)=>{
    try{
        const {name,members} = req.body;
        
        //console.log("grpImage",req.files.image)
        const grpImage=`https://api.dicebear.com/6.x/initials/svg?seed=${name}&backgroundColor=00897b,00acc1,039be5,1e88e5,3949ab,43a047,5e35b1,7cb342,8e24aa,c0ca33,d81b60,e53935,f4511e,fb8c00,fdd835,ffb300,ffd5dc,ffdfbf,c0aede,d1d4f9,b6e3f4&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-350,-340,-330,-320&fontFamily=Arial&fontWeight=600`
        
        const Creator = req.user
        
        
        
        if(!Array.isArray(members) || members.length<2){
            return res.status(400).json({
                success:false,
                message:"member should be more then 2"
            })
        }
        const allMembers=[...members,Creator.id]
        //console.log("allMembers",allMembers)
    
        const chat = await Chat.create({
            chatName:name,
            groupChat:true,
            creator:Creator.id,
            members:allMembers,
            image: grpImage
    
        })
        emitEvent(req,ALERT,allMembers,`welcome to ${name} group`)
        emitEvent(req,REFETCH_CHATS,members)
        return res.status(200).json({
            success:true,
            message:"grp chat created successfully",
            chat
        })



    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:`error in creating grp chat ${error}`
        })

    }
   
}

exports.getMyChats=async(req,res)=>{
    try{
        
        const chats = await Chat.find({members:req.user.id}).populate('members','userName')

        const transformChats =chats.map(({_id,chatName,groupChat,members,image})=>{
            return({
                _id,
                groupChat,
                image,
                chatName,
                members:members.reduce((prev,curr)=>{
                    if(curr._id.toString()!==req.user.id.toString()){
                        prev.push(curr._id);
                    }
                    return prev;
                },[]),
            })
        })

        return res.status(200).json({
            success:true,
            message:"all chats fetch",
            chats:transformChats
        })
    }
    catch(error){
        console.log("error",error)
        return res.status(400).json({
            success:false,
            message:"error in geting chats",

            
        })
    }
}
exports.getMyFriends=async(req,res)=>{
    try{
        
        const chats = await Chat.find({members:req.user.id,groupChat:false}).populate('members','userName')

        const transformChats =chats.map(({_id,chatName,groupChat,members,image})=>{
            return({
                _id,
                groupChat,
                image,
                chatName,
                members:members.reduce((prev,curr)=>{
                    if(curr._id.toString()!==req.user.id.toString()){
                        prev.push(curr._id);
                    }
                    return prev;
                },[]),
            })
        })

        return res.status(200).json({
            success:true,
            message:"all chats fetch",
            chats:transformChats
        })
    }
    catch(error){
        console.log("error",error)
        return res.status(400).json({
            success:false,
            message:"error in geting chats",

            
        })
    }
}

exports.getMessages= async(req,res)=>{
    try{
        const chatId = req.params.id;
        const page = req.query.pages ? parseInt(req.query.pages, 10) : 1;

        console.log("page",page);
        const resultPerPage = 20;
        const skip = (page - 1) * resultPerPage;
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({
                success:false,
                message:"no chat found"
            })
        }
        if(!chat.members.includes(req.user.id.toString())){
            return res.status(403).json({
                success:false,
                message:"your are not allowed to view this chat"
            })
        }
        const [messages, totalMessagesCount] = await Promise.all([
            Message.find({ chat: chatId })
              .sort({ createdAt: -1 })
              .skip(skip)
              .limit(resultPerPage)
              .populate("sender", "userName")
              .lean(),
            Message.countDocuments({ chat: chatId }),
          ]);
        
          const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;
        
          return res.status(200).json({
            success: true,
            messages: messages.reverse(),
            totalPages,
          });
    }
    catch(error){
            return res.status(404).json({
                success:false,
                message:"server error"
            })
    }
}
