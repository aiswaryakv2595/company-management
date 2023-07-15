const express = require("express");
const multer = require("../middleware/multer");
const commonRouter = express.Router();

const { login, authUser, updateProfile, forgotPassword, resetPassword, verifyOtp, addOnduty, ondutyListing, ondutyListingAll, ondutyApprove } = require('../controller/globalController');
const { jwtAuth } = require('../middleware/jwtAuth');
const { updateStatus } = require('../controller/projectController');

commonRouter.post('/', login);
commonRouter.get('/details', jwtAuth,multer.upload.single("profilePic"), authUser);
commonRouter.patch("/update-profile",jwtAuth,multer.upload.single("profilePic"),updateProfile)

commonRouter.post('/forgot-password',forgotPassword)


commonRouter.post('/verify-otp',verifyOtp)
commonRouter.post('/reset-password',resetPassword)

commonRouter.post('/update-task-status',jwtAuth,updateStatus)

commonRouter.get('/onduty',jwtAuth,ondutyListing)
commonRouter.get('/onduty-list',jwtAuth,ondutyListingAll)
commonRouter.post('/add-onduty',jwtAuth,addOnduty)
commonRouter.patch('/onduty-approve',jwtAuth,ondutyApprove)

module.exports = commonRouter;