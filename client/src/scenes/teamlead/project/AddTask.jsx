import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  TextField,
  Modal,
  Button,
  MenuItem,
  LinearProgress,
  Avatar,
  IconButton,
  Menu,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Header from "../../../components/Header";
import { adminApi, teamleadApi } from "../../../redux/api/employeeApi";
import { useSelector } from "react-redux";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const AddTask = () => {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    starting_date: "",
    due_date: "",
    assigned_to: "",
    priority: "",
  });
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await teamleadApi.teamMembers();
        const data = response.team;

        setEmployees(data);
      } catch (error) {
        console.log("Error fetching employee details:", error);
      }
    };

    const fetchProjectDetails = async () => {
      try {
        const response = await teamleadApi.getTeamleadProject();

        const data = response.project;
        setProject(data);
      } catch (error) {
        console.log("Error fetching project details:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const projectId = new URLSearchParams(window.location.search).get("id");
        if (!projectId) {
          return;
        }

        const response = await teamleadApi.singleProjectLead(projectId);

        const sampleTasks = response.task;
        setTasks(sampleTasks);
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };

    fetchProjectDetails();
    fetchEmployeeDetails();
    fetchTasks();
  }, [isLoggedIn]);

  const handleAddTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token is null or undefined");
        return;
      }
      const projectId = new URLSearchParams(window.location.search).get("id");

      const response = await teamleadApi.addTask(inputs, projectId);

      const newTask = response.task;
      setTasks((prevTasks) => [...prevTasks, newTask]);
      toast.success("Task added successfully");
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const handleEdit = (task) => {
    setEditedTask(task);
    setInputs({
      title: task.title,
      description: task.description,
      starting_date: task.starting_date,
      due_date: task.due_date,
      assigned_to: task.assigned_to,
      priority: task.priority,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const onDragStart = (start) => {
    const { draggableId } = start;
    const task = tasks.find((t) => t._id === draggableId);

    setEditedTask(task);
  };

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedTasks = Array.from(tasks);

    // Reorder within the same column
    if (destination.droppableId === source.droppableId) {
      const columnTasks = updatedTasks.filter(
        (task) => task.status === source.droppableId
      );

      const [movedTask] = columnTasks.splice(source.index, 1);
      columnTasks.splice(destination.index, 0, movedTask);

      updatedTasks.forEach((task, index) => {
        if (task.status === source.droppableId) {
          task.position = index;
        }
      });
    } else {
      // Move to a different column
      const sourceTasks = updatedTasks.filter(
        (task) => task.status === source.droppableId
      );
      const destinationTasks = updatedTasks.filter(
        (task) => task.status === destination.droppableId
      );

      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.status = destination.droppableId;
      destinationTasks.splice(destination.index, 0, movedTask);

      updatedTasks.forEach((task, index) => {
        if (task.status === source.droppableId) {
          task.position = index;
        } else if (task.status === destination.droppableId) {
          task.position = index;
        }
      });

      // Update the task status in the backend
      try {
        await teamleadApi.updateTask({
          task_id: movedTask._id,
          status: destination.droppableId,
        });
      } catch (error) {
        console.log("Error updating task status:", error);
        // You can handle the error accordingly
      }
    }

    setTasks(updatedTasks);
  };

  return (
    <Box m="1.5rem 2.5rem">
      {tasks.length > 0 && (
        <Header title={project.project_name} subtitle="Task Details" />
      )}
      <DragDropContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">To Do</Typography>
              <Button variant="contained" onClick={() => setIsModalOpen(true)}>
                Add Task
              </Button>
              <Droppable droppableId="todo">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      .filter((task) => task.status === "todo")
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card sx={{ mb: 2 }}>
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <Typography variant="h6" gutterBottom>
                                      Title: {task.title}
                                    </Typography>
                                    <IconButton
                                      onClick={handleClick}
                                      size="small"
                                      sx={{ ml: 2 }}
                                      aria-controls={
                                        open ? "account-menu" : undefined
                                      }
                                      aria-haspopup="true"
                                      aria-expanded={
                                        open ? "true" : undefined
                                      }
                                    >
                                      <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                      id="lock-menu"
                                      anchorEl={anchorEl}
                                      open={open}
                                      onClose={handleClose}
                                      MenuListProps={{
                                        "aria-labelledby": "lock-button",
                                        role: "listbox",
                                      }}
                                    >
                                      <MenuItem
                                        onClick={handleEdit.bind(null, task)}
                                      >
                                        Edit
                                      </MenuItem>
                                    </Menu>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Description: {task.description}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Assigned to{" "}
                                      {task.assigned_to.first_name}
                                    </Typography>
                                    <Avatar
                                      src={
                                        task.assigned_to.profilePic
                                          ? `http://localhost:5000/dp/${task.assigned_to.profilePic}`
                                          : ""
                                      }
                                    />
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={25}
                                    sx={{
                                      "& .MuiLinearProgress-bar": {
                                        backgroundColor: "blue",
                                      },
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      mt: 1,
                                    }}
                                  >
                                    <AccessTimeIcon />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ ml: 1 }}
                                    >
                                      {new Date(
                                        task.due_date
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Priority: {task.priority}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Ongoing</Typography>
              <Droppable droppableId="ongoing">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      .filter((task) => task.status === "ongoing")
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card sx={{ mb: 2 }}>
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    Title: {task.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Description: {task.description}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Assigned to{" "}
                                      {task.assigned_to.first_name}
                                    </Typography>
                                    <Avatar
                                      src={
                                        task.assigned_to.profilePic
                                          ? `http://localhost:5000/dp/${task.assigned_to.profilePic}`
                                          : ""
                                      }
                                    />
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={50}
                                    sx={{
                                      "& .MuiLinearProgress-bar": {
                                        backgroundColor: "blue",
                                      },
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      mt: 1,
                                    }}
                                  >
                                    <AccessTimeIcon />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ ml: 1 }}
                                    >
                                      {new Date(
                                        task.due_date
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Priority: {task.priority}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Complete</Typography>
              <Droppable droppableId="complete">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks
                      .filter((task) => task.status === "complete")
                      .map((task, index) => (
                        <Draggable
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Card sx={{ mb: 2 }}>
                                <CardContent>
                                  <Typography variant="h6" gutterBottom>
                                    Title: {task.title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Description: {task.description}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Assigned to{" "}
                                      {task.assigned_to.first_name}
                                    </Typography>
                                    <Avatar
                                      src={
                                        task.assigned_to.profilePic
                                          ? `http://localhost:5000/dp/${task.assigned_to.profilePic}`
                                          : ""
                                      }
                                    />
                                  </Box>
                                  <LinearProgress
                                    variant="determinate"
                                    value={100}
                                    sx={{
                                      "& .MuiLinearProgress-bar": {
                                        backgroundColor: "blue",
                                      },
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexDirection: "row",
                                      mt: 1,
                                    }}
                                  >
                                    <AccessTimeIcon />
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{ ml: 1 }}
                                    >
                                      {new Date(
                                        task.due_date
                                      ).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Priority: {task.priority}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Paper>
          </Grid>
        </Grid>
      </DragDropContext>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            outline: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {isEditMode ? "Edit Task" : "Add Task"}
          </Typography>
          <TextField
            label="Task Name"
            value={inputs.title}
            name="title"
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Starting Time"
                type="date"
                name="starting_date"
                value={inputs.starting_date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Deadline"
                type="date"
                name="due_date"
                value={inputs.due_date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
              />
            </Grid>
          </Grid>
          <TextField
            label="Assigned to"
            name="assigned_to"
            value={inputs.assigned_to}
            onChange={handleChange}
            fullWidth
            select
            sx={{ mb: 2 }}
          >
            {employees?.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.first_name + " " + employee.last_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Description"
            value={inputs.description}
            onChange={handleChange}
            fullWidth
            multiline
            name="description"
            rows={4}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Priority"
            value={inputs.priority}
            onChange={handleChange}
            fullWidth
            name="priority"
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAddTask}>
            {isEditMode ? "Update" : "Add"}
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AddTask;
