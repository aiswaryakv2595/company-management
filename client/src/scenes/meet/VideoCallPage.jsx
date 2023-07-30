import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { adminApi } from '../../redux/api/employeeApi';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const VideoCallPage = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null); // Set initial value to null
  const role = useSelector((state) => state.employee.role);
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  console.log(role);

  useEffect(() => {
    // Fetch employee data from the backend when the component mounts
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

    // Generate a random room ID
    const newRoomId = uuidv4();

    navigate(`/${role}/room/${newRoomId}`);
  }, [navigate, role, employee]);

  return (
    <div>
      <Box m="1.5rem 2.5rem" sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
      <Grid xs={2}>
      <Typography>Create a meeting</Typography>
      </Grid>
      <Grid xs={4}>
      <Button variant='contained' color='info' onClick={handleJoin}>
        create
      </Button>
        </Grid>
      
      </Grid>

      </Box>
    </div>
  );
};

export default VideoCallPage;
