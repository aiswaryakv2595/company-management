import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { adminApi } from '../../redux/api/employeeApi';
import { styled, useTheme } from '@mui/material/styles';

const CenteredBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const VideoCallPage = () => {
  const theme = useTheme()
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null); 
  const role = useSelector((state) => state.employee.role);
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  console.log(role);

  useEffect(() => {
   
    const fetchEmployeeData = async () => {
      try {
        const response = await adminApi.userDetails();
        const data = response.employee;
        console.log(data);
        setEmployee(data);
      } catch (error) {
        console.error('Failed to fetch employee data:', error);
      }
    };

    if (isLoggedIn) {
      fetchEmployeeData();
    }
  }, [isLoggedIn]);

  const handleJoin = useCallback(() => {
    if (!employee) {
      console.log('Employee data not available yet');
      return;
    }

    const newRoomId = uuidv4();

    navigate(`/${role}/room/${newRoomId}`);
  }, [navigate, role, employee]);

  return (
    <CenteredBox>
    <Typography variant="h4" color="info" mb={4}>
      Start or Join a Meeting
    </Typography>
    <Button variant="contained"
   sx={{
    bgcolor: theme.palette.primary[50],
    color: theme.palette.secondary[1000],
    
  }}
    onClick={handleJoin}>
      Create a Meeting
    </Button>
  </CenteredBox>
  );
};

export default VideoCallPage;
