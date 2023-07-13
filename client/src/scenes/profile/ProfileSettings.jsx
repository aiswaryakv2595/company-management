import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { api } from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { PhotoCamera } from "@mui/icons-material";
import "react-datepicker/dist/react-datepicker.css";
import { adminApi } from "../../redux/api/employeeApi";
import authApi from "../../redux/api/authApi";

const ProfileSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(min-width:1000px)");
  const [employee, setEmployee] = useState([]);
  const [formValues, setFormValues] = useState({
    phone: "",
    email: "",
    gender: "",
    address: "",
    profilePic: null,
  });
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await adminApi.userDetails();
        const data = response.employee;
        console.log("inside profile", data);
        setEmployee(data);
        setFormValues({
          phone: data.phone,
          email: data.email,
          dob: data.dob,
          gender: data.gender,
          address: data.address,
        });
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setFormValues((prevValues) => ({
      ...prevValues,
      profilePic: file,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleUpdateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("phone", formValues.phone);
      formData.append("email", formValues.email);
      formData.append("gender", formValues.gender);
      formData.append("address", formValues.address);
      if (formValues.profilePic) {
        formData.append("profilePic", formValues.profilePic);
      }

      const response = await authApi.updateProfile(formData);
      const updatedProfile = response.profile;

      setEmployee({
        ...employee,
        profilePic: updatedProfile.profilePic,
      });
      toast.success("profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Profile" />
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(2, minmax(0, 1fr))"
        justifyContent="space-between"
        rowGap="1px"
        columnGap="1px"
        sx={{
          "& > div": { gridColumn: isMobile ? undefined : "span 4" },
        }}
      >
        <Card
          xs={12}
          sm={6}
          sx={{ minWidth: 345, display: "flex", padding: 1 }}
        >
          <Avatar
            alt="Profile Picture"
            src={
              employee.profilePic
                ? `http://localhost:5000/dp/${employee.profilePic}`
                : ""
            }
            sx={{
              width: 150,
              height: 150,
            }}
          >
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleProfilePicChange}
              />
              <PhotoCamera sx={{ color: "black" }} />
            </IconButton>
          </Avatar>

          <CardContent>
            <Typography
              gutterBottom
              variant="h3"
              component="div"
              sx={{ textAlign: "left" }}
            >
              {`${employee.first_name} ${employee.last_name}`}
            </Typography>
            <Typography
              sx={{ textAlign: "left" }}
              variant="body2"
              color="text.secondary"
            >
              {employee.designation && employee.designation.designation}
            </Typography>
            <Typography variant="h6" component="div" sx={{ textAlign: "left" }}>
              Employee ID : {employee.emp_id}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Date of Join :{" "}
              {new Date(employee.joining_date).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>

        <Card xs={12} sm={6} sx={{ minWidth: 345 }}>
          <CardContent>
            {/* Phone Number */}
            <Box
              gap={2.5}
              sx={{ display: "flex", flexDirection: "row", width: "100%" }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ mr: 2, mt: 2 }}
              >
                Phone: {employee.phone}
              </Typography>
            </Box>
            {/* Email */}
            <Box
              gap={3.5}
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                mt: 1,
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ mr: 2, mt: 2 }}
              >
                Email: {employee.email}
              </Typography>
            </Box>

            <Box
              gap={1}
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                mt: 1,
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ mr: 2, mt: 2 }}
              >
                Gender: {employee.gender}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Card xs={12} sm={6} sx={{ minWidth: 345 }}>
        <CardContent>
          {/* Phone Number */}
          <Box
            gap={2.5}
            sx={{ display: "flex", flexDirection: "row", width: "100%" }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ mr: 2, mt: 2 }}
            >
              Phone:
            </Typography>
            <TextField
              type="text"
              name="phone"
              value={formValues.phone}
              fullWidth
              onChange={handleChange}
            />
          </Box>
          {/* Email */}
          <Box
            gap={3.5}
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              mt: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ mr: 2, mt: 2 }}
            >
              Email:
            </Typography>
            <TextField
              type="text"
              name="email"
              value={formValues.email}
              fullWidth
              onChange={handleChange}
            />
          </Box>

          <Box
            gap={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              mt: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ mr: 2, mt: 2 }}
            >
              Gender:
            </Typography>
            <TextField
              select
              variant="outlined"
              value={formValues.gender}
              sx={{ minWidth: 215 }}
              fullWidth
              onChange={handleChange}
              name="gender"
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Box>
          <Box
            gap={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              mt: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ mr: 2, mt: 2 }}
            >
              Address:
            </Typography>
            <TextField
              multiline
              type="textarea"
              rows={4}
              variant="outlined"
              value={formValues.address}
              sx={{ minWidth: 215 }}
              fullWidth
              onChange={handleChange}
              name="address"
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Button variant="contained" onClick={handleUpdateProfile}>
              Update
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileSettings;