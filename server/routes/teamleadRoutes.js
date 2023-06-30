const express = require('express')
const multer = require('../middleware/multer')
const { jwtAuth } = require('../middleware/jwtAuth')
const { viewTeamleadProject } = require('../controller/projectController')
const teamleadRoutes = express.Router()

teamleadRoutes.get('/view-project',jwtAuth,viewTeamleadProject)

module.exports = teamleadRoutes