import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
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

const ApproveComplaints = () => {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [complaints, setComplaints] = useState([]);
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
      );
      const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
      const [selectedComplaint, setSelectedComplaint] = useState(null);
      const [response, setResponse] = useState("")
      const fetchAllComplaints = async () =>{
        try {
          const response = await complaintsApi.viewAllComplaints()
          const data = response.complaints;
         setComplaints(data);
        } catch (error) {
          console.log("Error fetching  details:", error);
        }
      }
      useEffect(() => {
       
        if(isLoggedIn){
            fetchAllComplaints();
        }
       
      }, [isLoggedIn])
      const handleRespond = (complaint) => {
        setSelectedComplaint(complaint);
        setOpen(true); // Open the dialog/modal
      };
    

      const complaintsWithIndex = complaints?.map((row, index) => ({
        ...row,
        slNo: index + 1,
      }));
      const columns = [
        { field: "slNo", headerName: "Sl no", width: 70 },
        {
            field: "employeeID",
            headerName: "employee name",
            width: 130,
            valueGetter: (params) => `${params.row.employeeID.first_name} ${params.row.employeeID.last_name}`,
          },
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
            field: "actions",
            headerName: "Actions",
            width: 130,
            renderCell: (params) => (
              <Box
                sx={{ display: "flex", justifyContent: "flex-end" }}
                onClick={() => handleRespond(params.row)}
              >
               
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: theme.palette.primary[50],
                      color: theme.palette.secondary[1000],
                    }}
                  >
                    respond
                  </Button>
                
              </Box>
            ),
          },
      ];
    
      const handleSubmit = async (id) => {
        try {
          console.log("Complaint ID:", id);
          console.log("Response:", response);
      
          const updatedResponse = await complaintsApi.updateResponse(id, response);
          console.log("Updated response from server:", updatedResponse);
      
          setOpen(false);
          toast.success("Success");
          fetchAllComplaints()
        } catch (error) {
          console.error("Error submitting response:", error);
          toast.error("Error submitting response");
        }
      };
      
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="Complaints" subtitle="List of Complaints" />
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
        <DialogTitle>Respond to Complaint</DialogTitle>
        <DialogContent>
        {selectedComplaint && (
            <Box>
            
              <Typography variant="h6">{selectedComplaint.subject}</Typography>
              <Typography>{selectedComplaint.description}</Typography>
              
              <Grid container spacing={2} sx={{mt:2}}> 
              <Grid xs={4} >
               <Typography>Response</Typography>
              </Grid>
            <Grid xs={8}>
            <TextField
                multiline
                rows={4}
                fullWidth
                label="Response"
                value={response}
                onChange={(e)=>setResponse(e.target.value)}
              />
            </Grid>
              </Grid>
              
            </Box>
          )}
        </DialogContent>
        <DialogActions>
        <Button variant="contained" color="info" onClick={()=>setOpen(false)}>
            Cancel
          </Button>
          <Button
            sx={{
                bgcolor: theme.palette.primary[50],
                color: theme.palette.secondary[1000],
              }}
              onClick={()=>handleSubmit(selectedComplaint._id)}
          >
            Submit Response
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ApproveComplaints