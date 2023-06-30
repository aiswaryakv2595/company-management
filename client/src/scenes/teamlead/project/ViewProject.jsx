import { Box, Card, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import { useSelector } from 'react-redux';
import { api } from '../../../redux/api/api';

const ViewProject = () => {
    const [project, setProject] = useState([]);
    const isLoggedIn = useSelector((state) => state.employee.isLoggedIn);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Token is null or undefined");
          return;
        }
        const fetchProjectDetails = async () => {
            try {
              const response = await api.get("/teamlead/view-project", {
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
    
      if(isLoggedIn){
        fetchProjectDetails()
      }
    }, [isLoggedIn])
    
  return (
    <Box m="1.5rem 2.5rem">
        <Header title="All Projects" subtitle="Project Details" />
        {project.length > 0 ? (
        <Box
        mt="20px" display="flex" flexWrap="wrap" gap={2}
        >
          {project.map((prj) => (
            <Card key={prj._id}
            sx={{
              maxWidth: 345,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexGrow:1}}>
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  {prj.project_name}
                  
                </Typography>
                <Typography variant="h6" gutterBottom>
        Status: {prj.status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
        {prj.description}
        </Typography>
        <Typography variant="h6" gutterBottom sx={{mt:2}}>
        Deadline:
        <Typography 
         gutterBottom
         variant="h6"
         component="div">
        {new Date(prj.deadline).toLocaleDateString()}
        </Typography>
         
        </Typography>

        <Typography variant="h6" gutterBottom sx={{mt:2}}>
        Team Leader:
        <Typography 
         gutterBottom
         variant="h6"
         component="div">
        {prj.assigned_to.first_name +' '+prj.assigned_to.last_name}
        </Typography>
         
        </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : null}
    </Box>
  )
}

export default ViewProject