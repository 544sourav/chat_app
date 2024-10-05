const express = require("express")
const router = express.Router()
const {auth}= require('../middlewares/auth')
const{newGroupChat, getMyChats,getMessages,getMyFriends} = require("../controllers/Chats")

router.post("/creategroup",auth,newGroupChat)
router.get("/fetchchats",auth,getMyChats)
router.get("/myfriends",auth,getMyFriends)
router.get("/message/:id",auth,getMessages)



module.exports = router