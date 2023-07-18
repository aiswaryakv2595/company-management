import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { Box, Button, Divider, MenuItem, Modal, TableCell, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { adminApi, dutyApi, teamleadApi } from "../../../redux/api/employeeApi";
import EditIcon from "@mui/icons-material/Edit";
import Grid from '@mui/material/Unstable_Grid2';
import { DataGrid } from "@mui/x-data-grid";

const TeamleadTimesheet = () => {
  const theme = useTheme();
  const [openAddModal, setOpenAddModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [project, setProject] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [timesheet, setTimesheet] = useState([]);
  const [inputs, setInputs] = useState({
    date: "",
    project_id: "",
    task: "",
    time:""
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    // Fetch tasks for the selected project
    if (name === "project_id") {
      const selectedProject = project.find((prj) => prj._id === value);
      if (selectedProject) {
        const fetchTasks = async () => {
          try {
            const response = await teamleadApi.singleProjectLead(selectedProject._id);
            const taskData = response.task;
            console.log(response.task)
            setTasks(taskData);
          } catch (error) {
            console.log("Error fetching tasks:", error);
          }
        };
  
        fetchTasks();
      }
    }
  };
  
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await teamleadApi.getTeamleadProject();

        const data = response.project;

        setProject(data);
      } catch (error) {
        console.log("Error fetching project details:", error);
      }
    };
    const fetchTimesheetDetails = async () => {
        try {
          const response = await dutyApi.getTimesheet();
          const data = response.timesheet;
          console.log("Timesheet Data:", data); // Check the response here
          setTimesheet(data);
        } catch (error) {
          console.log("Error fetching timesheet details:", error);
        }
      };
      
    const fetchEmployeeDetails = async () => {
      try {
        const response = await adminApi.userDetails();
        const data = response.employee;

        setEmployee(data);
      } catch (error) {
        console.log("Error fetching employee details:", error);
      }
    };

    if (isLoggedIn) {
      fetchProjectDetails();
      fetchEmployeeDetails();
      fetchTimesheetDetails();
    }
  }, [isLoggedIn]);
  const handleAddTimesheet = async() => {
    try {
        const updatedResponse = await dutyApi.addTimesheet(inputs)
  
        
  
        const newTimesheet = updatedResponse.timesheet;
        toast.success("success")
        setTimesheet((prev) => [...prev, newTimesheet]);
        setOpenAddModal(false);
      } catch (error) {
        toast.error(error.message)
        console.log("Error editing department:", error);
      }
  }
  const timesheetWithIndex = timesheet.map((row, index) => ({
    ...row,
    slNo: index + 1,
  }));
  const columns = [
    { field: "slNo", headerName: "SL No", width: 70 },
    { field: "date", headerName: "Date", width: 200 },
    
    {
        field: "project_id",
        headerName: "Project Name",
        width: 200,
        valueGetter: (params) => params.row.project_id.project_name,
      },
      {
        field: "task",
        headerName: "Task",
        width: 200,
        valueGetter: (params) => {
          const taskId = params.row.task;
          const matchingTask = params.row.project_id.task.find(
            (task) => task._id === taskId
          );
          return matchingTask ? matchingTask.title : "";
        },
      },
      
      
      
      
      { field: "time", headerName: "Time", width: 100 },
   
  ];
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Timesheet" />
      <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary[50],
            color: theme.palette.secondary[1000],
          }}
            onClick={() => setOpenAddModal(true)}
        >
          + Add timesheet
        </Button>
      </Box>
      <Box mt="20px">
        <DataGrid
          rows={timesheetWithIndex}
          columns={columns}
          getRowId={(row) => row._id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          autoHeight
          checkboxSelection={false}
          disableSelectionOnClick
        />
      </Box>
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            width: "40%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
            padding: "20px",
            outline: "none",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add Timesheet
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Divider sx={{ border: 1 }} />
            <Grid container spacing={2}>
        <Grid xs={6}>
        <TextField
              label="Date"
              name="date"
              type="date"
              value={inputs.date}
              onChange={handleChange}
              fullWidth
             InputLabelProps={{
                shrink:true
             }
             }
            />
        </Grid>
        <Grid xs={6}>
        <TextField
              label="Project"
              name="project_id"
              value={inputs.project_id}
              onChange={handleChange}
             select
              fullWidth
            >
                {project.map((prj)=>(
                    <MenuItem key={prj._id} value={prj._id}>
                {prj.project_name ? prj.project_name : ""}
                </MenuItem>
                ))}
                
            </TextField>
        </Grid>
        <Grid xs={6}>
        <TextField
  label="Task"
  name="task"
  value={inputs.task}
  onChange={handleChange}
  select
  fullWidth
>
  {tasks.map((task) => (
    <MenuItem key={task._id} value={task._id}>
      {task.title ? task.title : ""}
    </MenuItem>
  ))}
</TextField>

        </Grid>
        <Grid xs={6}>
        <TextField
  label="Time"
  name="time"
  type="time"
  value={inputs.time}
  onChange={handleChange}
  InputLabelProps={{
    shrink: true,
  }}
  inputProps={{
    step: 300, // 5 minutes
  }}
  fullWidth
/>

        </Grid>
      </Grid>
            
            
            <Button
              variant="contained"
              sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.secondary[1000],
              }}
              onClick={handleAddTimesheet}
            >
              Submit
            </Button>
          </Box>
        </div>
      </Modal>
    </Box>
  );
};

export default TeamleadTimesheet;
