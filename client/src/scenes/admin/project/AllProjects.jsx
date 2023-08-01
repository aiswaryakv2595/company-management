import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api } from "../../../redux/api/api";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { saveAs } from "file-saver";
import {
  AttachmentOutlined,
  Diversity3,
  EditCalendar,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import { adminApi, projectApi } from "../../../redux/api/employeeApi";

const AllProjects = () => {
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [project, setProject] = useState([]);
  const [employees, setEmployees] = useState([]);

  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    project_name: "",
    starting_time: "",
    deadline: "",
    assigned_to: "",
    priority: "",
    status: "",
    description: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleImageSelect = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedImage(file);
    }
  };
  const theme = useTheme();
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await projectApi.getAllProject()

        const data = response.project;
      
        setProject(data);
       
      } catch (error) {
        console.log("Error fetching project details:", error);
      }
    };
    const fetchEmployeeDetails = async () => {
      try {
        const response = await adminApi.getTeamlead();
        const data = response.employees;

        setEmployees(data);
      } catch (error) {
        console.log("Error fetching employee details:", error);
      }
    };

    if (isLoggedIn) {
      fetchProjectDetails();
      fetchEmployeeDetails();
    }
  }, [isLoggedIn]);

  const handleAddProject = async () => {
    try {
     
      const formData = new FormData();
      formData.append("attachment", selectedImage, selectedImage?.name);

      Object.entries(inputs).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await projectApi.addProject(formData);

      const newProject = response.project;
      setProject((prevProjects) => [...prevProjects, newProject]);
      setOpenModal(false);
    } catch (error) {
      console.log("Error adding project:", error);
    }
  };
  const handleDownloadAttachment = (attachmentUrl) => {
    const filename = attachmentUrl.substring(
      attachmentUrl.lastIndexOf("/") + 1
    );
    const extension = filename.substring(filename.lastIndexOf(".") + 1);
    fetch(attachmentUrl)
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, `attachment.${extension}`);
      })
      .catch((error) => {
        console.log("Error downloading attachment:", error);
      });
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="All Projects" subtitle="Project Details" />
      <Grid container spacing={2} justifyContent="flex-end" marginBottom={1}>
      <Grid item xs={6} md={3}>
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary[50],
            color: theme.palette.secondary[1000],
            width: "100%",
          }}
          onClick={() => setOpenModal(true)}
        >
          + Add Project
        </Button>
        </Grid>
      </Grid>
      {project && project.length > 0 ? (
        <Grid container spacing={2}>
          {project?.map((prj) => (
            <Grid item xs={12} md={4}>
            <Card
              key={prj._id}
              sx={{
                maxWidth: 345,
              }}
            >
              <CardHeader
                action={
                  <>
                    <Link to={`/admin/edit-project/${prj._id}`}>
                      <IconButton
                        aria-label="settings"
                        sx={{
                          "&:hover": {
                            backgroundColor: "orange",
                          },
                          "&:hover svg": {
                            color: "white",
                          },
                          borderRadius: "50%",
                          width: "36px",
                          height: "36px",
                          padding: "4px",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            backgroundColor: "inherit",
                            transition: "background-color 0.3s ease",
                          }}
                        >
                          <EditCalendar sx={{ color: "green" }} />
                        </Box>
                      </IconButton>
                    </Link>
                  </>
                }
                title={prj.project_name}
                subheader={new Date(prj.starting_time).toLocaleDateString()}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status: {prj.status}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mt={2}>
                      <AttachmentOutlined sx={{ marginRight: "5px" }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        onClick={() => handleDownloadAttachment(prj.attachment)}
                        sx={{
                          marginLeft: "5px",
                          cursor: "pointer",
                        }}
                      >
                        1 File
                      </Typography>
                      <IconButton
                        aria-label="download attachment"
                        onClick={() => handleDownloadAttachment(prj.attachment)}
                        sx={{ marginLeft: "5px" }}
                      ></IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" mt={2}>
                      <Diversity3 sx={{ marginRight: "8px" }} />
                      <Typography variant="body2">
           {prj.assigned_to.first_name}
          </Typography>
                    </Box>
                  </Grid>
                </Grid>
               
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Deadline:
                  <Typography
                    gutterBottom
                    variant="body2"
                    color="text.secondary"
                  >
                    {new Date(prj.deadline).toLocaleDateString()}
                  </Typography>
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Team Leader:
                  <Typography gutterBottom variant="h6" component="div">
                    {prj.assigned_to.first_name +
                      " " +
                      prj.assigned_to.last_name}
                  </Typography>
                </Typography>
                <Typography gutterBottom variant="h6" component="div">
                  Team:
                </Typography>
                <Box mt={2}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={10}
                    sx={{
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "green",
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>no data</Box>
      )}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        {/* Modal Content */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#ffffff",
            padding: "20px",
            outline: "none",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Project
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <TextField
              label="Project Name"
              variant="outlined"
              value={inputs.project_name}
              fullWidth
              onChange={handleChange}
              name="project_name"
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Starting Time"
                  type="date"
                  name="starting_time"
                  value={inputs.starting_time}
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
                  name="deadline"
                  value={inputs.deadline}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Assigned To"
              variant="outlined"
              value={inputs.assigned_to}
              fullWidth
              onChange={handleChange}
              name="assigned_to"
              select
            >
              {employees?.map((employee) => (
                <MenuItem key={employee._id} value={employee._id}>
                  {employee.first_name}
                </MenuItem>
              ))}
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Priority"
                  variant="outlined"
                  value={inputs.priority}
                  fullWidth
                  onChange={handleChange}
                  name="priority"
                  select
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Status"
                  type="text"
                  name="status"
                  value={inputs.status}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
            <TextField
              label="Attachment"
              type="file"
              variant="outlined"
              fullWidth
              onChange={handleImageSelect}
              name="attachment"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <span id="file-name-span"></span>

            <TextField
              multiline
              rows={4}
              label="Description"
              type="textarea"
              variant="outlined"
              value={inputs.description}
              fullWidth
              onChange={handleChange}
              name="description"
            />
            <Button variant="contained" onClick={handleAddProject}>
              Submit
            </Button>
          </Box>
        </div>
      </Modal>
    </Box>
  );
};

export default AllProjects;
