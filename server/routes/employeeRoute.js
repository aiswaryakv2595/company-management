const express = require('express')
const { jwtAuth } = require('../middleware/jwtAuth')
const { employeeProject, employeeTask } = require('../controller/employeeController')
const multer = require("../middleware/multer");
const employeeRouter = express.Router()
 employeeRouter.get('/view-project',jwtAuth,employeeProject)
 employeeRouter.get('/view-task',jwtAuth,employeeTask)

module.exports = employeeRouter