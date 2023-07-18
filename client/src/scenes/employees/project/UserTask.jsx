import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  LinearProgress,
  Avatar,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Header from "../../../components/Header";
import { api } from "../../../redux/api/api";
import { useSelector } from "react-redux";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { employeeApi, teamleadApi } from "../../../redux/api/employeeApi";

const UserTask = () => {
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState([]);

  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  useEffect(() => {
   
    const fetchProjectDetails = async () => {
      try {
      
        const response = await employeeApi.getEmployeeProject()

        const data = response.project;
        setProject(data);
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const projectId = new URLSearchParams(window.location.search).get("id");
        if (!projectId) {
          return; 
        }

       
        const response = await employeeApi.getEmployeeTask(projectId)

        const sampleTasks = response.task;
        console.log("task----", sampleTasks);
        setTasks(sampleTasks);
      } catch (error) {
        console.log("Error fetching tasks:", error);
      }
    };
    fetchProjectDetails();
    fetchTasks();
  }, [isLoggedIn]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    movedTask.status = destination.droppableId.split("-")[1];
    updatedTasks.splice(destination.index, 0, movedTask);

    setTasks(updatedTasks);
    console.log("movedTask", movedTask.status);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token is null or undefined");
        return;
      }

      const response = await teamleadApi.updateTask({
        task_id: movedTask._id,
        status: movedTask.status,
      });
      if(response)
      toast.success(`Moved to ${movedTask.status}`);
    } catch (error) {
      console.log("Error updating task status:", error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      {tasks.length > 0 && (
        <Header title={project[0].project_name} subtitle="Task Details" />
      )}

      <Typography variant="h6" component="h2">
        Team Lead :
        {project.map((prj)=>(
          prj.assigned_to.first_name
        ))}
       
      </Typography>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">To Do</Typography>

              <Droppable droppableId="column-todo">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {Array.isArray(tasks) &&
                      tasks
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
                                    <Typography variant="h6" gutterBottom>
                                      Title: {task.title}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Description : {task.description}
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
                                      Priority {task.priority}
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
              <Droppable droppableId="column-ongoing">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {Array.isArray(tasks) &&
                      tasks
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
                                      Description : {task.description}
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
                                      Priority {task.priority}
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
              <Droppable droppableId="column-complete">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {Array.isArray(tasks) &&
                      tasks
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
                                      Description : {task.description}
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
                                      Priority {task.priority}
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
    </Box>
  );
};

export default UserTask;
