const express = require('express')
const { adminSignup, employeeDetails, addEmployees } = require('../controller/adminController')
const { jwtAuth } = require('../middleware/jwtAuth')

const adminRouter = express.Router()

adminRouter.post('/signup',adminSignup)
// adminRouter.post('/',adminLogin)
// adminRouter.get('/details',jwtAuth,authUser)
adminRouter.get('/employees',jwtAuth,employeeDetails)
adminRouter.post('/addemployees',jwtAuth,addEmployees)

module.exports = adminRouter