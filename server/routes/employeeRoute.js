const express = require('express')
const { jwtAuth } = require('../middleware/jwtAuth')
const { updateProfile } = require('../controller/employeeController')
const multer = require("../middleware/multer");
const employeeRouter = express.Router()

// employeeRouter.patch("/update-profile",jwtAuth,multer.upload.single("profilePic"),updateProfile)

module.exports = employeeRouter