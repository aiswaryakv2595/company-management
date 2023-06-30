const express = require('express')
const multer = require('../middleware/multer')
const { adminSignup, employeeDetails, addEmployees } = require('../controller/adminController')
const { jwtAuth } = require('../middleware/jwtAuth')
const { viewAllProject, addProject } = require('../controller/projectController')


const adminRouter = express.Router()

adminRouter.post('/signup',adminSignup)
adminRouter.get('/employees',jwtAuth,employeeDetails)
adminRouter.post('/addemployees',jwtAuth,addEmployees)
adminRouter.get('/project',jwtAuth,viewAllProject)
adminRouter.post('/addproject',jwtAuth, multer.upload.single('attachment'),addProject)



module.exports = adminRouter