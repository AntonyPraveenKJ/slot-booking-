const express=require('express');
const { AdminLogin, verifyAdminToken, getAdmin, refreshAdminToken, adminLogout, getRegData, showData, processData, processing, showDetailedData, approveData, getApprovedData, showApprovedData, declineData, getSlot, postBooked, getTrue } = require('../controllers/admin-controllers');
const router=express.Router()

//router.post('/adminsignup',AdminSignup);
router.post('/admin',AdminLogin);
router.get('/adminhome',verifyAdminToken,getAdmin);
router.get('/adminrefresh',refreshAdminToken,verifyAdminToken,getAdmin);
router.post('/adminlogout',verifyAdminToken,adminLogout)
router.get('/getDetails',getRegData);
router.get('/showData/:id',showData);
router.put('/processData/:id',processData);
router.get('/getProcessed',processing);
router.get('/showDetailedData/:id',showDetailedData);
router.put('/approveRequest/:id',approveData);
router.get('/getApproved',getApprovedData);
router.get('/showApprovedData/:id',showApprovedData);
router.put('/declineData/:id',declineData);
router.get('/getSlot',getSlot);
router.post('/slotDetails',postBooked);
router.get('/getTrue',getTrue);

module.exports=router;