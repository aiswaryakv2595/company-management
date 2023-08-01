const express = require('express')
const multer = require('../middleware/multer')
const { jwtAuth } = require('../middleware/jwtAuth')
const { viewTeamleadProject, addTask, viewTask, updateStatus } = require('../controller/projectController')
const { dashboard, teamMembers, sendMeetingLink } = require('../controller/teamleadController')
const teamLeadRoutes = express.Router()

teamLeadRoutes.get('/team-members',jwtAuth,teamMembers)
teamLeadRoutes.post('/send-meeting-id',jwtAuth,sendMeetingLink)
teamLeadRoutes.get('/view-project',jwtAuth,viewTeamleadProject)
teamLeadRoutes.post('/addtask',jwtAuth,addTask)
teamLeadRoutes.get('/view-task',jwtAuth,viewTask)

teamLeadRoutes.get('/dashboard',jwtAuth,dashboard)
module.exports = teamLeadRoutes