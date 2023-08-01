// VideoPlayer.js

import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { adminApi, teamleadApi } from '../../redux/api/employeeApi';
import { useSelector } from 'react-redux';
import { Box, Button, Card, CardActions, CardContent, Chip, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography, useTheme } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const VideoPlayer = () => {
  const { roomId } = useParams();
  const theme = useTheme();
  const [employee, setEmployee] = useState([]);
  const [team, setTeam] = useState([]);
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const [personName, setPersonName] = useState([]);
  const zegoRef = useRef(null);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === 'string' ? value.split(',') : value);
  };

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await teamleadApi.teamMembers()
        setTeam(response.team)
      } catch (error) {
        console.log(error)
      }
    }
    if (isLoggedIn) {
      fetchReport();
      fetchTeamMembers();
    } else {
      setEmployee([]);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      cleanupZego();
    };
  }, []);

  const cleanupZego = () => {
    if (zegoRef.current) {
      try {
        zegoRef.current.stopRecording();
        zegoRef.current.stopStream(); 
        zegoRef.current.leaveRoom();
        zegoRef.current.destroy();
      } catch (error) {
        console.error('Error cleaning up Zego:', error);
      }
    }
  };
  

  const fetchReport = async () => {
    try {
      const response = await adminApi.userDetails();
      const data = response.employee;
      console.log(data);
      setEmployee(data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
    }
  };

  const myMeeting = async (element) => {
    if (!employee || !employee.first_name) {
      console.log('User data is incomplete or not available yet');
      return;
    }

    const appID = 905303586;
    const serverSecret = '041dd5548a2d9e1f8ba6380c45671395';
    const { first_name } = employee;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, Date.now().toString(), first_name);

    const zc = ZegoUIKitPrebuilt.create(kitToken);
    zegoRef.current = zc;

    zc.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
    });
  };

  const handleSendMeetingID = async () => {
    if (!employee || !employee.first_name) {
      console.log('User data is incomplete or not available yet');
      return;
    }

   
    const selectedEmails = personName.map((name) => name.email);

   
    try {
      console.log(selectedEmails)
      const response = await teamleadApi.sendMeetingIDEmail({
        from:employee.email,
        meetingID: roomId,
        emailAddresses: selectedEmails,
      });

     
      console.log('Emails sent successfully:', response);
    } catch (error) {
      console.error('Failed to send emails:', error);
    }
  };

  useEffect(() => {
    if (employee && employee.first_name) {
      const element = document.getElementById('videoContainer');
      myMeeting(element);
    }
  }, [employee, roomId]);

  return (
    <Grid container>
  <Grid item xs={12} md={8}>
   
      {employee && employee.first_name ? (
        <div id="videoContainer" />
      ) : (
        <div>Loading...</div>
      )}
    
  </Grid>
      <Grid item xs={12} md={4}>
     
      <Card sx={{height:"100%",mr:"1rem", display:"flex", flexDirection:"column", justifyContent:"center"}}>
      <CardContent>
      <Typography variant="h4" gutterBottom>
       Add Members to meeting
      </Typography>
        <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
        
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          fullWidth
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value.email} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {team.map((name) => (
            <MenuItem key={name._id} value={name} style={getStyles(name, personName, theme)}>
              {name.email}
            </MenuItem>
          ))}
        </Select>
        
        <TextField label="Meeting ID" color="info" fullWidth focused value={roomId} sx={{ mt: 2 }} />
       </CardContent>
       <CardActions sx={{display:"flex", justifyContent:"center"}}>
      <Button variant="contained" onClick={handleSendMeetingID}>
        Send
      </Button>
      </CardActions>
      </Card>
      </Grid>
    </Grid>
  );
};

export default VideoPlayer;
