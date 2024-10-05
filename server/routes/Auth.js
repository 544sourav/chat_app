const express = require('express')
const router = express.Router()

const {
    sendOtp,
    signup,
    login,
    checkUserName
} = require('../controllers/Auth')

const {
    searchUser
}= require('../controllers/User')

router.post('/login',login)

router.post('/signup',signup)

router.post('/sendotp',sendOtp)
router.post('/checkusername',checkUserName)
router.get('/search',searchUser)

module.exports =router
