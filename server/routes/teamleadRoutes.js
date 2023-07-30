const express = require('express')
const multer = require('../middleware/multer')
const { jwtAuth } = require('../middleware/jwtAuth')
const { viewTeamleadProject, addTask, viewTask, updateStatus } = require('../controller/projectController')
const { dashboard } = require('../controller/teamleadController')
const teamLeadRoutes = express.Router()

teamLeadRoutes.get('/view-project',jwtAuth,viewTeamleadProject)
teamLeadRoutes.post('/addtask',jwtAuth,addTask)
teamLeadRoutes.get('/view-task',jwtAuth,viewTask)

teamLeadRoutes.get('/dashboard',jwtAuth,dashboard)
module.exports = teamLeadRoutes