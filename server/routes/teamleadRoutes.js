const express = require('express')
const multer = require('../middleware/multer')
const { jwtAuth } = require('../middleware/jwtAuth')
const { viewTeamleadProject, addTask, viewTask, updateStatus } = require('../controller/projectController')
const teamleadRoutes = express.Router()

teamleadRoutes.get('/view-project',jwtAuth,viewTeamleadProject)
teamleadRoutes.post('/addtask',jwtAuth,addTask)
teamleadRoutes.get('/view-task',jwtAuth,viewTask)
// teamleadRoutes.post('/update-task-status',jwtAuth,updateStatus)
module.exports = teamleadRoutes