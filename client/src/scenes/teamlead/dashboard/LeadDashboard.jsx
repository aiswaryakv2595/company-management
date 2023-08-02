import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { adminApi, dutyApi, teamleadApi } from "../../../redux/api/employeeApi";
import moment from "moment";
import StatBox from "../../../components/Admin/StatBox";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import MuiGrid from "@mui/material/Grid";
import styled from "@emotion/styled";
import { baseURL } from "../../../redux/api/api";
import {useNavigate} from 'react-router-dom'
import { AssignmentTurnedInOutlined, EventAvailableOutlined } from "@mui/icons-material";
const LeadDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const currentDate = moment().format("DD-MM-YYYY");
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const [employee, setEmployee] = useState([]);
  const isNonMediumScreens = useMediaQuery("(min-width:1200px)");
  const [dashboardData, setDashboardData] = useState({
    projectCount: 0,
    statusCounts: {},
    pendingTasks: [],
  });
  const [leaveData, setLeaveData] = useState({
    ondutyTypeCounts: [],
    lopBalance: 0,
    statusCounts: [],
    balanceLeave: 0,
  });
  const Grid = styled(MuiGrid)(({ theme }) => ({
    width: "100%",
    ...theme.typography.body2,
    '& [role="separator"]': {
      margin: theme.spacing(0, 2),
    },
  }));

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
        const response = await teamleadApi.dashboard();
        const data = response;
        const leaveResponse = await dutyApi.attendance();
        setDashboardData(data);
        setLeaveData(leaveResponse);
      } catch (error) {}
    };
    if (isLoggedIn) {
      fetchReport();
      fetchDashboard();
    }
  }, [isLoggedIn]);

  return (
    <Box>
      <Box
        backgroundColor={theme.palette.common.white}
        p="1.25rem 1rem"
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Avatar
          alt={employee.first_name}
          src={`${baseURL}/dp/${employee.profilePic}`}
          sx={{ width: 56, height: 56, borderRadius: 0, marginRight: 3 }}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" gutterBottom>
            Welcome {employee.first_name}
          </Typography>
          <Typography>{currentDate}</Typography>
        </Box>
      </Box>
      <Box m="1.5rem 2.5rem">
        <Box
          mt="20px"
          display="grid"
          gridTemplateColumns="repeat(12,1fr)"
          gridAutoRows="140px"
          gap="20px"
          sx={{
            "& > div": {
              gridColumn: isNonMediumScreens ? undefined : "span 12",
            },
          }}
        >
          <StatBox
            title="Total Projects"
            value={dashboardData.projectCount}
            icon={
              <EventAvailableOutlined  sx={{ fontSize: "40px" }} />
            }
          />
          <StatBox
            title="Progress Projects"
            value={dashboardData.statusCounts?.pending || 0}
            icon={<AccountTreeOutlinedIcon sx={{ fontSize: "40px" }} />}
          />
          <StatBox
            title="Finished Projects"
            value={dashboardData.statusCounts?.complete || 0}
            icon={
              <AssignmentTurnedInOutlined
                sx={{ fontSize: "40px" }}
              />
            }
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" gutterBottom>
              Task pending today
            </Typography>

            <Box
              p="1.25rem 1rem"
              borderRadius="0.55rem"
              width="100%"
              sx={{ display: "flex", flexDirection: "column" }}
              backgroundColor={theme.palette.secondary[20]}
              height="80%"
            >
              {dashboardData.pendingTasks &&
                dashboardData.pendingTasks.map((task, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <Typography>{task.title}</Typography>
                    <Typography>
                      Due on{" "}
                      {new Date(task.due_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h4" gutterBottom>
              Your Leave
            </Typography>

            <Box p="1.25rem 1rem" borderRadius="0.55rem" height="80%" width="100%" backgroundColor={theme.palette.secondary[20]}>
              <Box display="flex" alignItems="center">
                <Grid container>
                  <Grid item xs>
                    LEAVE TAKEN
                    <Box>
                      {" "}
                      {leaveData.statusCounts.find(
                        (item) => item._id === "Leave"
                      )?.count || 0}
                    </Box>
                  </Grid>
                  <Divider
                    orientation="vertical"
                    flexItem
                    sx={{
                      backgroundColor: "black",
                      border: "1px solid black",
                      mx: "50px",
                    }}
                  />
                  <Grid item xs>
                    REMAINING
                    <Box>{leaveData.balanceLeave || 0}</Box>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Button variant="contained" color="info" onClick={()=>navigate('/teamlead/leaves')}>
                  Add Leave
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LeadDashboard;
