import React, { useEffect, useState } from "react";
import moment from "moment";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  TextField,
  MenuItem,
  Modal,
  Grid,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import Header from "../../../components/Header";
import { adminApi } from "../../../redux/api/employeeApi";
import FlexBetween from "../../../components/FlexBetween";

const AllEmployees = () => {
  const isMobile = useMediaQuery("(min-width:1000px)");
  const [employee, setEmployee] = useState([]);
  const [department, setDepartment] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [inputs, setInputs] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    joining_date: "",
    phone: "",
    dob: "",
    designation: "",
    gender: "",
    age: "",
    role: "",
    tl_id: "",
  });
  const [searchInputs, setSearchInputs] = useState({
    emp_id: "",
    employeeName: "",
    designation: "",
  });
  //error handling
  const [isFirstNameValid, setFirstNameValid] = useState(true);
  const [isLastNameValid, setLastNameValid] = useState(true);
  const [isEmailValid, setEmailValid] = useState(true);
  const [isPasswordValid, setPasswordValid] = useState(true);
  const [isPhoneValid, setPhoneValid] = useState(true);
  const [isDateOfBirthValid, setDateOfBirthValid] = useState(true);
  const [isJoinDateValid, setJoinDateValid] = useState(true);
  // Columns configuration
  const columns = [
    { field: "emp_id", headerName: "ID", width: 80 },
    { field: "first_name", headerName: "First Name", width: 100 },
    { field: "last_name", headerName: "Last Name", width: 100 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "designation",
      headerName: "Designation",
      width: 200,
      valueGetter: (params) => params.row.department[0].designation,
    },
    { field: "role", headerName: "Role", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 130,
      renderCell: (params) => (
        <Box
          sx={{ display: "flex", justifyContent: "flex-end" }}
          onClick={() => handleBlock(params.row._id)}
        >
          {params.row.isActive ? (
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.secondary[1000],
              }}
            >
              BLOCK
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.secondary[1000],
              }}
            >
              UNBLOCK
            </Button>
          )}
        </Box>
      ),
    },
  ];

  // Fetch departments and user details on login
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const theme = useTheme();

  const fetchUserDetails = async () => {
    try {
      const response = await adminApi.allEmployees();
      const data = response.employees;
      console.log("employee", data);
      setEmployee(data);
    } catch (error) {
      console.log("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await adminApi.getDepartment();
        const data = response.department;
        setDepartment(data);
      } catch (error) {}
    };

    if (isLoggedIn) {
      fetchUserDetails();
      fetchDepartment();
    }
  }, [isLoggedIn]);
 // Calculate age from date of birth
 const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    const date = new Date(value);
    if (name === "dob") {
      const dateOfBirth = new Date(value);

      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 18);

      if (dateOfBirth <= minDate) {
        setDateOfBirthValid(true);
      } else {
        setDateOfBirthValid(false);
      }

      // Calculate and update age
      const age = calculateAge(dateOfBirth);
      setInputs((prevInputs) => ({
        ...prevInputs,
        age: age.toString(), // Convert age to string for TextField
      }));
    }
    if (name === "joining_date") {
   
      const joinDate = date;
  
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 5);
  
      if (joinDate >= minDate) {
        setJoinDateValid(true);
      } else {
        setJoinDateValid(false);
      }
    }
  };

  // Handle search inputs
  const handleSearch = (e) => {
    setSearchInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleAddEmployee = async () => {
    try {
      let isValid = true;

      // Validate first name
      if (!inputs.first_name || inputs.first_name.trim() === "") {
        setFirstNameValid(false);
        isValid = false;
      } else {
        setFirstNameValid(true);
      }

      // Validate last name
      if (!inputs.last_name || inputs.last_name.trim() === "") {
        setLastNameValid(false);
        isValid = false;
      } else {
        setLastNameValid(true);
      }

      // Validate email
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!inputs.email || !emailPattern.test(inputs.email)) {
        setEmailValid(false);
        isValid = false;
      } else {
        setEmailValid(true);
      }

      // Validate password
      if (!inputs.password || inputs.password.length < 8) {
        setPasswordValid(false);
        isValid = false;
      } else {
        setPasswordValid(true);
      }

      // Validate phone
      if (!inputs.phone || inputs.phone.trim() === "") {
        setPhoneValid(false);
        isValid = false;
      } else {
        setPhoneValid(true);
      }

      if (isValid) {
        const response = await adminApi.addEmployee(inputs);

        const newEmployee = response.employee;
        console.log("New Employee:", newEmployee);

        // Fetch the updated employee list
        const updatedResponse = await adminApi.allEmployees();

        const updatedData = updatedResponse.employees;
        console.log("Updated Employee List:", updatedData);

        setEmployee(updatedData);
        fetchUserDetails();
        toast.success("Employee added successfully");
        setOpenModal(false);
      }
    } catch (error) {
      console.log("Error adding employee:", error);
    }
  };

  const handleSearchEmployee = async () => {
    try {

      const response = await adminApi.searchEmployee(searchInputs);

      const search = response.search;
      const found = response.found;
  
      if (!found) {
        toast.info("No matching records found");
      }
  
      setEmployee(search);
    } catch (error) {
      console.log("Error searching employee:", error);
    }
  };
   // Initialize the minDateOfBirth state in useEffect
 
  const handleBlock = async (employeeId) => {
    try {
      const response = await adminApi.blockEmployee({ id: employeeId });

      const updatedEmployee = response.employee;
      if (updatedEmployee.isActive)
        toast.success(`${updatedEmployee.first_name} is Blocked`);
      else toast.success(`${updatedEmployee.first_name} is Unblocked`);

      fetchUserDetails();
    } catch (error) {
      console.log("Error updating employee status:", error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="All Employees" subtitle="Employee Details" />
     
      <Grid container spacing={2} justifyContent="flex-end" marginBottom={1}>
      <Grid item xs={6} md={3}>
          <Button
            variant="contained"
            sx={{
              bgcolor: theme.palette.primary[50],
              color: theme.palette.secondary[1000],
              width: "100%", 
            }}
            onClick={() => setOpenModal(true)}
          >
            + Add Employee
          </Button>
        </Grid>
        </Grid>
     
      <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
      <TextField
          id="outlined-basic"
          label="Employee ID"
          variant="outlined"
          name="emp_id"
          value={searchInputs.emp_id}
          onChange={handleSearch}
          sx={{ minWidth: 100, mb: isMobile ? 0 : 1 }}
        />
      </Grid>
      <Grid item xs={12} md={3}>
      <TextField
          id="outlined-basic"
          label="Employee Name"
          variant="outlined"
          name="employeeName"
          value={searchInputs.employeeName}
          onChange={handleSearch}
         
        />
      </Grid>
      <Grid item xs={12} md={3}>
      <TextField
          select
          label="Designation"
          variant="outlined"
          name="designation"
          value={searchInputs.designation}
          onChange={handleSearch}
          sx={{ minWidth: 230}}
        >
          {department.map((dept) => (
            <MenuItem key={dept._id} value={dept._id}>
              {dept.designation ? dept.designation : ""}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={3}>
      <Button
          variant="contained"
          color="success"
          onClick={handleSearchEmployee}
          sx={{
            padding: "10px",
            width:"100%",
            backgroundColor: "#f27457",
           
          }}
        >
          Search
        </Button>
      </Grid>
      </Grid>




    
      {employee.length > 0 ? (
        <Box mt="20px">
          <DataGrid
            rows={employee}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: isMobile ? 5 : 10 }, 
              },
            }}
            autoHeight
            checkboxSelection={false}
            disableSelectionOnClick
          />
        </Box>
      ) : <Typography variant="h6" align="center" color="textSecondary">
      No matching records found
    </Typography>}
      {/* Add User Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        {/* Modal Content */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
            padding: "20px",
            outline: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Employee
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Name Input */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="First Name"
                  name="first_name"
                  value={inputs.first_name}
                  onChange={handleChange}
                  error={!isFirstNameValid}
                  helperText={!isFirstNameValid && "First Name is required"}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={inputs.last_name}
                  onChange={handleChange}
                  error={!isLastNameValid}
                  helperText={!isLastNameValid && "Last Name is required"}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  error={!isEmailValid}
                  helperText={
                    !isEmailValid && "Please enter a valid email address"
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                  error={!isPasswordValid}
                  helperText={
                    !isPasswordValid &&
                    "Password should be a minimum of 8 characters"
                  }
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
              <TextField
                  label="Joining Date"
                  type="date"
                  name="joining_date"
                  value={inputs.joining_date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: moment().format("YYYY-MM-DD"),
                  }}
                  error={!isJoinDateValid}
                  helperText={!isJoinDateValid && "Invalid entry"}
                  required
                />
              </Grid>
              <Grid item xs={6}>
              <TextField
                  label="Date of birth"
                  type="date"
                  name="dob"
                  value={inputs.dob}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: moment().format("YYYY-MM-DD"),
                  }}
                  error={!isDateOfBirthValid}
                  helperText={!isDateOfBirthValid && "Date of Birth should be at least 18 years ago"}
                  required
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Age"
                  name="age"
                  value={inputs.age}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={inputs.phone}
                  onChange={handleChange}
                  error={!isPhoneValid}
                  helperText={!isPhoneValid && "Phone is required"}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Gender"
                  variant="outlined"
                  value={inputs.gender}
                  sx={{ minWidth: 215 }}
                  onChange={handleChange}
                  name="gender"
                  required
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Designation"
                  name="designation"
                  select
                  value={inputs.designation}
                  fullWidth
                  onChange={handleChange}
                  required
                >
                  {department.map((dept) => (
                    <MenuItem key={dept._id} value={dept._id}>
                      {dept.designation ? dept.designation : ""}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              select
              label="Role"
              variant="outlined"
              value={inputs.role}
              sx={{ minWidth: 215 }}
              onChange={handleChange}
              name="role"
              required
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="teamlead">Team Lead</MenuItem>
            </TextField>
            <TextField
              select
              label="Reporting to"
              variant="outlined"
              value={inputs.tl_id}
              sx={{ minWidth: 215 }}
              onChange={handleChange}
              name="tl_id"
            >
              {employee
                ?.filter((emp) => emp.role !== "employee")
                .map((emp) => (
                  <MenuItem key={emp._id} value={emp._id}>
                    {emp.first_name}
                  </MenuItem>
                ))}
            </TextField>
            {/* Submit Button */}
            <Button variant="contained" onClick={handleAddEmployee}>
              Submit
            </Button>
          </Box>
        </div>
      </Modal>
    </Box>
  );
};

export default AllEmployees;
