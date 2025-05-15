const express = require('express');
const router = express.Router();
const userAuth = require('../middlewares/userAuth')
const { registerUsers, otpLogin, startRoute, verifyOtp, deleteUser, getUserDetails, emailOtp, updateUser, checkRegistration } = require('../controllers/user.controllers')

//starter route
router.get('/all', startRoute)

//otp login
router.post('/login', otpLogin)

//register user
router.post('/register', userAuth, registerUsers)

//verify otp
router.post('/verify-otp', verifyOtp)

// delete user
router.delete('/delete-user/:id', userAuth, deleteUser)

//get user details 
router.get('/user-details', userAuth, getUserDetails)

//send mail otp 
router.post('/email-otp', emailOtp)

//check registration status
router.get('/check-registration/:mobileNo', checkRegistration)

router.put('/update/:id', updateUser);

module.exports = router