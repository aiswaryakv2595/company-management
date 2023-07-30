const express = require('express')
const { jwtAuth } = require('../middleware/jwtAuth')
const { employeeProject, employeeTask, dashboard } = require('../controller/employeeController')
const multer = require("../middleware/multer");
const employeeRouter = express.Router()
 employeeRouter.get('/view-project',jwtAuth,employeeProject)
 employeeRouter.get('/view-task',jwtAuth,employeeTask)
 employeeRouter.get('/employee-dashboard',jwtAuth,dashboard)

module.exports = employeeRouter