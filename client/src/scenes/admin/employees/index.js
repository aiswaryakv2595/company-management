import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  CardMedia,
  useMediaQuery,
  TextField,
  MenuItem,
  Modal,
  Grid,
} from "@mui/material";
import { useSelector } from "react-redux";
import { api } from "../../../redux/api/api";
import Header from "../../../components/Header";

const AllEmployees = () => {
  const isMobile = useMediaQuery("(min-width:1000px)");
  const [employee, setEmployee] = useState([]);
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
    age:"",
    role:""
  });
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("Token is null or undefined");
          return;
        }

        const response = await api.get("/admin/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.employee;
        console.log("data------", data);
        setEmployee(data);
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);

//add user

const handleAddEmployee = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token is null or undefined");
      return;
    }

    const response = await api.post(
      "/admin/addemployees",
      inputs,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const newEmployee = response.data.employee;
    console.log("New Employee:", newEmployee);

    // Fetch the updated employee list
    const updatedResponse = await api.get("/admin/employees", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const updatedData = updatedResponse.data.employee;
    console.log("Updated Employee List:", updatedData);

    setEmployee(updatedData);
    setOpenModal(false);
  } catch (error) {
    console.log("Error adding employee:", error);
  }
};


  return (
    <Box m="1.5rem 2.5rem">
      <Header title="All Employees" subtitle="Employee Details" />
      <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          sx={{
            bgcolor: "#FF9B44",
          }}
          onClick={() => setOpenModal(true)}
        >
          + Add Employee
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        flexWrap="wrap"
        gap={1}
        mb="20px"
      >
        <TextField
          id="outlined-basic"
          label="Employee ID"
          variant="outlined"
          sx={{ minWidth: 200 }}
        />

        <TextField
          id="outlined-basic"
          label="Employee Name"
          variant="outlined"
          sx={{ minWidth: 250 }}
        />

        <TextField
          select
          label="Designation"
          variant="outlined"
          sx={{ minWidth: 250 }}
        >
          {employee.map((emp) => (
            <MenuItem key={emp._id} value={emp.designation}>
              {emp.designation ? emp.designation : ""}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          color="success"
          sx={{ padding: "10px", minWidth: 200 }}
        >
          Search
        </Button>
      </Box>

      {employee.length > 0 ? (
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          justifyContent="space-between"
          rowGap="20px"
          columnGap="1.33%"
          sx={{
            "& > div": { gridColumn: isMobile ? undefined : "span 4" },
          }}
        >
          {employee.map((emp) => (
            <Card key={emp._id} sx={{ maxWidth: 345 }}>
              <CardMedia
                sx={{ height: 140, borderRadius: "50%" }}
                image={emp.profilePic || "/placeholder.png"}
                title="Profile Picture"
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  {emp.first_name + " " + emp.last_name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  {emp.designation}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : null}
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
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last Name"
                  name="last_name"
                  value={inputs.last_name}
                  onChange={handleChange}
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
                />
              </Grid>
              <Grid item xs={6}>
              <TextField
            label="Password"
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
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
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={inputs.phone}
                  onChange={handleChange}
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
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
              <TextField
                  label="Designation"
                  name="designation"
                  value={inputs.designation}
                  onChange={handleChange}
                />
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
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="teamlead">Team Lead</MenuItem>
                </TextField>
            {/* Submit Button */}
            <Button variant="contained" onClick={handleAddEmployee}>Submit</Button>
          </Box>
        </div>
      </Modal>
    </Box>
  );
};

export default AllEmployees;
