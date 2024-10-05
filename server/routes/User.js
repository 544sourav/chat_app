const express = require('express')
const router = express.Router()

const {
    searchUser,
    sendFrinedRequest,
    acceptFriendRequest,
    getNotification
}= require('../controllers/User')

const { auth } = require('../middlewares/auth')

router.get('/search',auth,searchUser)
router.get('/fetchrequest',auth,getNotification)
router.put('/sendrequest',auth,sendFrinedRequest)
router.put('/reciverequest',auth,acceptFriendRequest)

module.exports =router
