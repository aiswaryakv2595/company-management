const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const app = express()
app.use(morgan('dev'))
dotenv.config()
app.use(cors({credentials:true,origin:"http://localhost:3000"}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
dotenv.config()
mongoose.connect('mongodb://127.0.0.1:27017/CMS').then(()=>{
    app.listen(5000)
    console.log('Database connected in port 5000')
}).catch((err) => console.log(err))
//Admin routes
const adminRouter = require('./routes/adminRoutes');
const employeeRouter = require('./routes/employeeRoute');
const teamleadRouter = require('./routes/teamleadRoutes')
const { login, authUser } = require('./controller/globalController');
const { jwtAuth } = require('./middleware/jwtAuth');

app.use('/api/admin',adminRouter)
app.use('/api/employee',employeeRouter)
app.use('/api/teamlead',teamleadRouter)


app.post('/api',login)
app.get('/api/details',jwtAuth,authUser)
