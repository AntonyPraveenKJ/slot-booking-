const express=require('express');
const { signup, login, verifyToken, getUser, refreshToken, logout, formdata, getBookedDetails, showBooked } = require('../controllers/user-contollers');
const router=express.Router()

router.post('/signup',signup);
router.post('/',login);
router.get('/user',verifyToken,getUser);
router.get('/refresh',refreshToken,verifyToken,getUser);
router.post('/logout',verifyToken,logout);
router.post('/regForm',formdata);
router.get('/getBookDetails',getBookedDetails)
router.get('/showBooked/:id',showBooked)


module.exports=router;