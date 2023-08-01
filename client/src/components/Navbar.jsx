import React, { useState, useEffect } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  NotificationsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "./FlexBetween";
import { setMode } from "../redux/slices/themeSlice";
import { logout } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { api, baseURL } from "../redux/api/api";
import { adminApi, employeeApi } from "../redux/api/employeeApi";


function Navbar({ isSidebarOpen, setIsSidebarOpen, showBackground }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl); // check if the dropdown is open or not
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const handleProfile = () => {
    if (employee.role === "admin") navigate("/admin/profile");
    else if (employee.role === "employee") navigate("/profile");
    else navigate("/teamlead/profile");
  };

  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
      
        const response = await adminApi.userDetails()
        const data = response.employee;
console.log('navbar ',response)
        setEmployee(data);
      } catch (error) {
        if (error && error.status === 401) {
          // Check if the token is expired based on the custom property "isTokenExpired"
          if (error.data.isTokenExpired) {
            // Show message to the user (optional)
            console.log('Token expired. Please log in again.');
            
            // Clear user session (token) - this depends on how you handle the token in your app
            // For example:
            // localStorage.removeItem('token');
            
            // Redirect to login page (you can use React Router or your preferred method)
            // For example:
            // history.push('/login');
          } else {
            // Show message for other unauthorized cases (optional)
            console.log('You are not authorized to access this page.');
          }
        } else {
          // Show message for other errors (optional)
          console.log('error',error)
          console.log('An error occurred while fetching data.');
        }
      
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);

  return (
    <AppBar
      sx={{
        position: "static",
        background: theme.palette.background.default,
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon sx={{ color: theme.palette.primary[50] }} />
          </IconButton>
        </FlexBetween>
        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton>
            <NotificationsOutlined
              sx={{ fontSize: "30", color: theme.palette.primary[50] }}
            />{" "}
            {/* Notification icon */}
          </IconButton>
          <FlexBetween>
            {isLoggedIn ? (
              <Button
                onClick={handleClick}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textTransform: "none",
                  gap: "1rem",
                }}
              >
                {employee.profilePic ? (
                  <Box
                    component="img"
                    alt="profile pic"
                    onError={(e) => {
                      console.log("Error loading image:", e.target.src);
                    }}
                    src={`${baseURL}/dp/${employee.profilePic}`}
                    height="32px"
                    width="32px"
                    borderRadius="50%"
                    sx={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    component="div"
                    alt="profile"
                    height="32px"
                    width="32px"
                    borderRadius="50%"
                    sx={{
                      backgroundColor: theme.palette.primary[50],
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  ></Box>
                )}
                {employee && (
                  <Box textAlign="left">
                    <Typography
                      fontWeight="bold"
                      fontSize="0.85rem"
                      sx={{ color: theme.palette.primary[50] }}
                    >
                      {employee.first_name}
                    </Typography>
                  </Box>
                )}
                <ArrowDropDownOutlined
                  sx={{ color: theme.palette.primary[50], fontSize: "25px" }}
                />
              </Button>
            ) : (
              <Button>Login</Button>
            )}
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MenuItem
                sx={{ color: theme.palette.primary[50] }}
                onClick={handleProfile}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{ color: theme.palette.primary[50] }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;