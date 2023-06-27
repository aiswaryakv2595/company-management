import React, { useState, useEffect } from 'react';
import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, NotificationsOutlined, ArrowDropDownOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography, useTheme } from '@mui/material';
import FlexBetween from './FlexBetween';
import { setMode } from '../redux/slices/themeSlice';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { api } from '../redux/api/api';

function Navbar({ isSidebarOpen, setIsSidebarOpen ,showBackground }) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl); // check if the dropdown is open or not
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const [firstName, setFirstName] = useState('');
  const [profilePic, setProfilePic] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');


        if (!token) {
          console.log('Token is null or undefined');
          return;
        }

        const response = await api.get('/details', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        const { first_name, profilePic } = response.data.employee;
      console.log(response.data)
        
        setFirstName(first_name);
        setProfilePic(profilePic);
      } catch (error) {
        console.log('Error fetching user details:', error);
      }
    };
    
  
    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn]);
  

  return (
    <AppBar
      sx={{
        position: 'static',
        ...(showBackground && {
          background: 'linear-gradient(to right, #ff9b44, #fc6075)',
        }),
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
        </FlexBetween>
        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlined sx={{ fontSize: '25px' }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: '25px' }} />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlined sx={{ fontSize: '25' }} /> {/* Notification icon */}
          </IconButton>
          <FlexBetween>
            {isLoggedIn ? (
              <Button
                onClick={handleClick}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  textTransform: 'none',
                  gap: '1rem',
                }}
              >
                {profilePic ? (
                  <Box
                    component="img"
                    alt="profile"
                    src={profilePic}
                    height="32px"
                    width="32px"
                    borderRadius="50%"
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box
                    component="div"
                    alt="profile"
                    height="32px"
                    width="32px"
                    borderRadius="50%"
                    sx={{
                      backgroundColor: theme.palette.secondary[100],
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    
                  </Box>
                )}
                <Box textAlign="left">
                  <Typography
                    fontWeight="bold"
                    fontSize="0.85rem"
                    sx={{ color: theme.palette.secondary[100] }}
                  >
                    {firstName}
                  </Typography>
                </Box>
                <ArrowDropDownOutlined
                  sx={{ color: theme.palette.secondary[300], fontSize: '25px' }}
                />
              </Button>
            ) : (
              <Button>Login</Button>
            )}
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <MenuItem onClick={handleLogout} sx={{ color: theme.palette.primary[400] }}>Log Out</MenuItem>

            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
