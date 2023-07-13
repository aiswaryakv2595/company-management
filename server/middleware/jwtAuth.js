const jwt = require('jsonwebtoken');
const Employee = require('../model/Employee');

const jwtAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    const decodedToken = jwt.verify(token, process.env.JWT_ADMIN); 

    const empId = decodedToken.empId;
    const email = decodedToken.email;
    const role = decodedToken.role

    
    const employee = await Employee.findOne({ _id: empId, email: email,role:role });

    if (!employee) {
      throw new Error();
    }

    // Attach the admin details to the request object
    req.employee = employee;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized.' });
  }
};

module.exports = {
    jwtAuth
};
