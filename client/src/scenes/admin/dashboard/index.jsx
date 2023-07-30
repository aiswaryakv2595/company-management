import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AdjustIcon from '@mui/icons-material/Adjust';
import FlexBetween from "../../../components/FlexBetween";
import Header from "../../../components/Header";
import StatBox from "../../../components/Admin/StatBox";
import EmailIcon from "@mui/icons-material/Email";
import GroupIcon from "@mui/icons-material/Group";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useSelector } from "react-redux";
import { adminApi, dutyApi } from "../../../redux/api/employeeApi";
import { baseURL } from "../../../redux/api/api";

function Dashboard() {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width:1200px)");
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const [employee, setEmployee] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    projectCount: 0,
    employeeCount: 0,
    taskCount: 0,
    ProjectStatusCounts: {},
    DutyStatusCounts: {},
    statusCountsTask:{},
    pendingTasks: [],
    LeaveData: [],
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await adminApi.userDetails();
        const data = response.employee;
        // console.log(data)
        setEmployee(data);
      } catch (error) {}
    };
    const fetchDashboard = async () => {
      try {
        const response = await adminApi.dashboard();
        const data = response;
        console.log('dashboard',data);
      
        setDashboardData(data);
       
      } catch (error) {}
    };
    if (isLoggedIn) {
      fetchReport();
      fetchDashboard();
    }
  }, [isLoggedIn]);
  return (
    <Box m="1.5rem 2.5rem">
      <FlexBetween>
        <Header title="Welcome Admin" subtitle="Dashboard" />
      </FlexBetween>
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(12,1fr)"
        gridAutoRows="140px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
        }}
      >
        <StatBox
          title="Projects"
          value={dashboardData.projectCount}
          icon={<EmailIcon sx={{ fontSize: "40px" }} />}
        />
        <StatBox
          title="Tasks"
          value={dashboardData.taskCount}
          icon={<FormatListBulletedIcon sx={{ fontSize: "40px" }} />}
        />
        <StatBox
          title="Employees"
          value={dashboardData.employeeCount}
          icon={<GroupIcon sx={{ fontSize: "40px" }} />}
        />
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(12,1fr)"
        minHeight="270px"
        gap="20px"
        sx={{
          "& > div": { gridColumn: isNonMediumScreens ? undefined : "span 12" },
          mb:"50px"
        }}
      >
        <Box
          gridColumn="span 4"
          gridRow="span 1"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.secondary[20]}
          borderRadius="0.55rem"
          alignItems="center"
          width="100%"
        >
          <Typography>Statitics</Typography>
          <Box
            width="100%"
            sx={{
              marginTop: "1rem",
              marginBottom: "1rem",
              paddingBottom: "0.3rem",
            }}
          >
            <FlexBetween>
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                Today Leave
              </Typography>
              <Typography>
                {dashboardData.DutyStatusCounts?.Leave || 0}
              </Typography>
            </FlexBetween>

            <LinearProgress
              variant="determinate"
              value={dashboardData.DutyStatusCounts?.Leave || 0}
              sx={{
                mt:1,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "green",
                },
              }}
            />
          </Box>
          <Box
            width="100%"
            sx={{
              marginTop: "1rem",
              marginBottom: "1rem",
              
            }}
          >
            <FlexBetween>
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                Completed Project
              </Typography>
              <Typography>
                {dashboardData.ProjectStatusCounts?.complete || 0}
              </Typography>
            </FlexBetween>

            <LinearProgress
              variant="determinate"
              value={dashboardData.ProjectStatusCounts?.complete || 0}
              sx={{
                mt:1,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "green",
                },
              }}
            />
          </Box>
          <Box
            width="100%"
            sx={{
              marginTop: "1rem",
              marginBottom: "1rem",
             
            }}
          >
            <FlexBetween>
              <Typography variant="body1" sx={{ textAlign: "left" }}>
                On Duty
              </Typography>
              <Typography>
                {dashboardData.DutyStatusCounts?.Present || 0}
              </Typography>
            </FlexBetween>

            <LinearProgress
              variant="determinate"
              value={dashboardData.DutyStatusCounts?.Present || 0}
              sx={{
                mt:1,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "green",
                },
              }}
            />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 1"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p="1.25rem 1rem"
          flex="1 1 100%"
          backgroundColor={theme.palette.secondary[20]}
          borderRadius="0.55rem"
          alignItems="center"
        >
          <Typography>Task Statitics</Typography>
          <FlexBetween>
            <Box
            backgroundColor={theme.palette.secondary[20]}
            padding={1} marginRight={1}>
              <Typography variant="h6" gutterBottom>Total Task</Typography>
              <Box sx={{display:"flex",justifyContent:"center"}}>
              <Typography variant="h4" gutterBottom>{dashboardData.taskCount}</Typography>
              </Box>
             
              </Box>
            <Box
            backgroundColor={theme.palette.secondary[20]}
            padding={1}>
              <Typography variant="h6" gutterBottom>Pending Task </Typography>
              <Box sx={{display:"flex",justifyContent:"center"}}>
              <Typography variant="h4" gutterBottom>{dashboardData.statusCountsTask?.todo || 0}</Typography>
              </Box>
              </Box>
          </FlexBetween>
          <List>
      <ListItem disablePadding>
        <ListItemIcon>
          <AdjustIcon color="success" />
        </ListItemIcon>
        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
          <ListItemText primary="Completed Tasks" />
          <Chip label={dashboardData.statusCountsTask?.complete || 0} color="success" sx={{ borderRadius: 0 }} />
        </Stack>
      </ListItem>
      <ListItem disablePadding>
        <ListItemIcon>
          <AdjustIcon color="info" />
        </ListItemIcon>
        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
          <ListItemText primary="Ongoing Task" />
          <Chip label={dashboardData.statusCountsTask?.ongoing || 0} color="info" sx={{ borderRadius: 0 }} />
        </Stack>
      </ListItem>
      <ListItem disablePadding>
        <ListItemIcon>
          <AdjustIcon color="error" />
        </ListItemIcon>
        <Stack direction="row" alignItems="center" spacing={1} flexGrow={1}>
          <ListItemText primary="Pending Tasks" />
          <Chip label={dashboardData.statusCountsTask?.todo || 0} color="error" sx={{ borderRadius: 0 }} />
        </Stack>
      </ListItem>
    </List>
          
        </Box>
      
<Box
  gridColumn="span 4"
  gridRow="span 1"
  display="flex"
  flexDirection="column"
  justifyContent="space-between"
  p="1.25rem 1rem"
  flex="1 1 100%"
  backgroundColor={theme.palette.secondary[20]}
  borderRadius="0.55rem"
  alignItems="center"
>
  <Typography>
    Today's Absent{" "}
    <Chip label={dashboardData.DutyStatusCounts?.Leave || 0} color="error" sx={{ borderRadius: 0 }} />
  </Typography>
  <List sx={{ width: '100%', maxWidth: 360, bgcolor: theme.palette.secondary[20] }}>
  {dashboardData.LeaveData?.reverse().map((leave, index) => (
    <ListItem alignItems="flex-start" key={index}>
      <ListItemAvatar>
        <Avatar alt={leave.employeeData[0].first_name} src={`${baseURL}/dp/${leave.employeeData[0].profilePic}`} />
      </ListItemAvatar>
      <ListItemText
        primary={`${leave.employeeData[0].first_name} ${leave.employeeData[0].last_name}`}
        secondary={
          <FlexBetween>
            <Typography
              sx={{ display: 'inline' }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {leave.from}
            </Typography>
            {leave.leave_status}
          </FlexBetween>
        }
      />
    </ListItem>
  ))}
</List>

</Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
