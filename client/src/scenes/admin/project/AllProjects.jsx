import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useSelector } from "react-redux";
import { api } from "../../../redux/api/api";
import { MoreVert } from "@mui/icons-material";

const AllProjects = () => {
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const [project, setProject] = useState([]);
  const [employees, setEmployees] = useState([]);
  //for edit in project icon
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
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

  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token is null or undefined");
      return;
    }

    const fetchProjectDetails = async () => {
      try {
        const response = await api.get("/admin/project", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.project;
        console.log("data------", data);
        setProject(data);
      } catch (error) {
        console.log("Error fetching user details:", error);
      }
    };
    const fetchEmployeeDetails = async () => {
      try {
        const response = await api.get("/admin/employees?role=teamlead", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data.employee;
        console.log("employees data------", response.data);
        setEmployees(data);
      } catch (error) {
        console.log("Error fetching employee details:", error);
      }
    };
    //add employees

    if (isLoggedIn) {
      fetchProjectDetails();
      fetchEmployeeDetails();
    }
  }, [isLoggedIn]);

  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token is null or undefined");
        return;
      }

      const formData = new FormData();
      formData.append("attachment", selectedImage, selectedImage?.name);

      Object.entries(inputs).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await api.post("/admin/addproject", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Add this header for file upload
        },
      });

      const newProject = response.data.project;
      console.log("project-----", response.data);
      setProject((prevProjects) => [...prevProjects, newProject]);
      setOpenModal(false);
    } catch (error) {
      console.log("Error adding project:", error);
    }
  };

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="All Projects" subtitle="Project Details" />
      <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          sx={{
            bgcolor: "#FF9B44",
          }}
          onClick={() => setOpenModal(true)}
        >
          + Add Project
        </Button>
      </Box>
      {project.length > 0 ? (
        <Box mt="20px" display="flex" flexWrap="wrap" gap={2}>
          {project.map((prj) => (
            <Card
              key={prj._id}
              sx={{
                maxWidth: 245,
               
              }}
            >
              <CardHeader
                action={
                  <>
                    <IconButton
                      aria-label="settings"
                      onClick={handleMenuOpen}
                    >
                      <MoreVert />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                    </Menu>
                  </>
                }
                title={prj.project_name}
                subheader={new Date(prj.starting_time).toLocaleDateString()}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status: {prj.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {prj.description}
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Deadline:
                  <Typography gutterBottom variant="h6" component="div">
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
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : null}

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
              {employees.map((employee) => (
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
                  <MenuItem value="Male">High</MenuItem>
                  <MenuItem value="Female">Medium</MenuItem>
                  <MenuItem value="Female">Low</MenuItem>
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
