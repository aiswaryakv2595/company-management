import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  MenuItem,
} from "@mui/material";
import "./project.css"; // Import custom CSS file
import { adminApi, projectApi } from "../../../redux/api/employeeApi";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  quillFormats,
  quillModules,
} from "../../../styles/texteditor/quillModules";

const EditProject = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [formValues, setFormValues] = useState({
    project_name: "",
    starting_time: "",
    deadline: "",
    assigned_to: "",
    priority: "",
    status: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const handleDescriptionChange = (value) => {
    setFormValues((prev) => ({
      ...prev,
      description: value,
    }));
  };
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    // Optionally, you can also display the file name on the form
    const fileNameSpan = document.getElementById("file-name-span");
    if (fileNameSpan) {
      fileNameSpan.textContent = selectedFile.name;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("Token is null or undefined");
      return;
    }
    const fetchEmployeeDetails = async () => {
      try {
        const response = await adminApi.getTeamlead();
        const data = response.employees;

        setEmployees(data);
      } catch (error) {
        console.log("Error fetching employee details:", error);
      }
    };
    const fetchProjectDetails = async () => {
      try {
        const response = await projectApi.getSingleProject(projectId);

        const data = response.project;
        console.log("Project details:", data);
        setProject(data);
        setFormValues({
          project_name: data.project_name,
          starting_time: data.starting_time,
          deadline: data.deadline,
          assigned_to: data.assigned_to,
          priority: data.priority,
          status: data.status,
          attachment: data.attachment,
          description: data.description,
        });
      } catch (error) {
        console.log("Error fetching project details:", error);
      }
    };

    fetchProjectDetails();
    fetchEmployeeDetails();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await projectApi.updateProject(projectId, formValues);

      console.log("Project updated successfully:", response.project);
      toast.success("project Updated successfully");
    } catch (error) {
      console.log("Error updating project:", error);
    }
  };

  return (
    <div>
      {project ? (
        <Box m={2}>
          <Card sx={{ p: 5 }} fullWidth>
            <Typography variant="h2" gutterBottom>
              Edit Project
            </Typography>
            <form onSubmit={handleSubmit}>
              {/* Project name */}
              <TextField
                label="Project Name"
                variant="outlined"
                value={formValues.project_name}
                fullWidth
                onChange={handleChange}
                name="project_name"
              />

              {/* Time */}
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="starting_time"
                    label="Starting time"
                    variant="outlined"
                    value={new Date(
                      formValues.starting_time
                    ).toLocaleDateString()}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6} className="textfield-container">
                  <TextField
                    name="deadline"
                    label="Deadline"
                    variant="outlined"
                    value={new Date(formValues.deadline).toLocaleDateString()}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <TextField
                sx={{
                  mt: 2,
                }}
                label="Assigned To"
                variant="outlined"
                value={formValues.assigned_to}
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
              {/* priority and status */}
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Priority"
                    variant="outlined"
                    value={formValues.priority}
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
                    value={formValues.status}
                    fullWidth
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <TextField
                label="Attachment"
                type="file"
                variant="outlined"
                fullWidth
                onChange={handleFileChange}
                name="attachment"
                accept=".pdf,.doc,.docx"
                sx={{ mt: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <span id="file-name-span">
                {formValues.attachment ? formValues.attachment : ""}
              </span>

              <ReactQuill
                value={formValues.description}
                onChange={handleDescriptionChange}
                name="description"
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write something..."
                theme="snow"
              />
              <Button type="submit" variant="contained">
                Save
              </Button>
            </form>
          </Card>
        </Box>
      ) : (
        <div>Loading project details...</div>
      )}
    </div>
  );
};

export default EditProject;
