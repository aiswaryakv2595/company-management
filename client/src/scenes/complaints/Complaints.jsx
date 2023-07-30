import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import FlexBetween from "../../components/FlexBetween";
import {Editor, EditorState} from 'draft-js';
import { complaintsApi } from "../../redux/api/employeeApi";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";

const Complaints = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [complaints, setComplaints] = useState([]);
  const [inputs, setInputs] = useState({
    subject: "",
    description: "",
  });
  const [editorState, setEditorState] = React.useState(
    () => EditorState.createEmpty(),
  );
 
 

  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
  const role = useSelector((state) => state.employee.role);
  
  useEffect(() => {
    const fetchComplaints = async () =>{
      try {
        const response = await complaintsApi.viewComplaints()
        const data = response.complaints;
       console.log('complaints=',data)
       setComplaints(data);
      } catch (error) {
        console.log("Error fetching  details:", error);
      }
    }
    const fetchAllComplaints = async () =>{
      try {
        const response = await complaintsApi.viewAllComplaints()
        const data = response.complaints;
       setComplaints(data);
      } catch (error) {
        console.log("Error fetching  details:", error);
      }
    }
    if(isLoggedIn){
      fetchComplaints();
    }
 
  }, [isLoggedIn])
  
  const complaintsWithIndex = complaints?.map((row, index) => ({
    ...row,
    slNo: index + 1,
  }));
  const columns = [
    { field: "slNo", headerName: "Sl no", width: 130 },
    { field: "subject", headerName: "Subject", width: 130 },
    { field: "complaintID", headerName: "Complaint ID", width: 130 },
    {
        field: "status",
        headerName: "Status",
        width: 130,
      
      },
      {
        field: "description",
        headerName: "Description",
        width: 200,
      
      },
      {
        field: "response",
        headerName: "Response",
        width: 200,
      }
  
  ];

  const handleSubmit = async () => {
    try {
      const updatedResponse = await complaintsApi.addComplaints(inputs);
      const newComplaints = updatedResponse.complaints;
      toast.success("complaints added");
      setComplaints((prev) => [...prev, newComplaints]);
      setOpen(false);
    } catch (error) {
      toast.error("Duty already exists");
    }
  };
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Complaints" subtitle="List of Complaints" />
      <Box display="flex" justifyContent="flex-end" mb="20px">
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary[50],
            color: theme.palette.secondary[1000],
          }}
          onClick={() => setOpen(true)}
        >
          + Add Complaints
        </Button>
      </Box>

      {complaints && complaints.length > 0 ? (
      <Box mt="20px">
        <DataGrid
          rows={complaintsWithIndex}
          getRowId={(row) => row._id}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </Box>
       ) : null}

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
           <Typography variant="h4" gutterBottom>
            {"Add Complaints"}
            </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FlexBetween>
              <Typography sx={{ display: "flex", flexDirection: "column", mr: 5 }}>
                Subject
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                name="subject"
                value={inputs.subject}
                fullWidth
                onChange={handleChange}
              />
            </FlexBetween>
            <FlexBetween sx={{ mt: 2 }}>
              <Typography sx={{ display: "flex", flexDirection: "column", mr: 2 }}>
                Description
              </Typography>
              <TextField
                id="outlined-basic"
                variant="outlined"
                name="description"
                value={inputs.description}
                multiline
                rows={4}
                fullWidth
                onChange={handleChange}
              />
            </FlexBetween>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              bgcolor: theme.palette.primary[50],
              color: theme.palette.secondary[1000],
            }}
            onClick={handleSubmit}
            autoFocus
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Complaints;
