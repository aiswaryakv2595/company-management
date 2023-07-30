import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment"; // Import moment.js
import { Box, Button, Divider, Paper, Stack, Typography, styled } from "@mui/material";
import Header from "../../../components/Header";
import FlexBetween from "../../../components/FlexBetween";
import Grid from "@mui/material/Unstable_Grid2";
import html2pdf from "html2pdf.js";
import "./payroll.css";
const Item = styled(Box)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  border: 1,
}));

const SlipGenerator = () => {
  const location = useLocation();
  const { employeeData } = location.state;
  console.log("slip", employeeData);

  const formatDate = (date) => {
    // Format the date using moment.js
    return moment(date).format("DD-MM-YYYY");
  };
  const contentRef = useRef(null);
  const handleDownload = () => {
    const options = {
      margin: 10,
      filename: `salary_slip${formatDate(employeeData.salary[0].from)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate and download the PDF
    html2pdf().set(options).from(contentRef.current).save();
  };

  return (
    <Box m="1.5rem 2.5rem">
      {/* Slip content goes here */}
      <div ref={contentRef} className="salary-slip">
        <Header title="Salary slip" />
        <Grid container spacing={2}>
          <Grid item xs={4} md={4}>
            {" "}
            Employee ID :{" "}
          </Grid>
          <Grid item xs={8} md={8}>
            {employeeData.emp_id}
          </Grid>
          <Grid item xs={4} md={4}>
            {" "}
            Name :{" "}
          </Grid>
          <Grid item xs={8} md={8}>
            {employeeData.first_name} {employeeData.last_name}
          </Grid>
          <Grid item xs={4} md={4}>
            {" "}
            Department :{" "}
          </Grid>
          <Grid item xs={8} md={8}>
            {employeeData.department[0].department}
          </Grid>
          <Grid item xs={4} md={4}>
            {" "}
            Designation :{" "}
          </Grid>
          <Grid item xs={8} md={8}>
            {employeeData.department[0].designation}
          </Grid>
          <Grid item xs={4} md={4}>
            {" "}
            Joining Date :{" "}
          </Grid>
          <Grid item xs={8} md={8}>
            {formatDate(employeeData.joining_date)}
          </Grid>
          <Grid item xs={4} md={4}>
            {" "}
            Pay Period :{" "}
          </Grid>
          <Grid item xs={8} md={8}>
            {formatDate(employeeData.salary[0].from)} to{" "}
            {formatDate(employeeData.salary[0].to)}
          </Grid>
        </Grid>

       
        <Box sx={{ flexGrow: 1, maxWidth: "600px",mt:1}}>
          <Grid container spacing={2}>
            <Grid xs={12} md={12}>
              <Typography variant="h5" gutterBottom sx={{textDecoration:"underline"}}>
                Earnings
              </Typography>
              <Stack>
                <Item>
                  <FlexBetween>
                    <Typography> Basic Salary</Typography>
                    <Typography>
                      {" "}
                      {"\u20B9"} {employeeData.salary[0].base_salary}
                    </Typography>
                  </FlexBetween>
                </Item>
                <Item>
                  <FlexBetween>
                    <Typography> Rent Allowance</Typography>
                    <Typography>
                      {"\u20B9"} {employeeData.salary[0].rent_allowance}
                    </Typography>
                  </FlexBetween>
                </Item>
                <Item>
                  <FlexBetween>
                    <Typography> Net Salary</Typography>
                    <Typography>
                      {"\u20B9"} {employeeData.salary[0].net_salary}
                    </Typography>
                  </FlexBetween>
                </Item>
              </Stack>
            </Grid>
            <Grid xs={12} md={12}>
            <Typography variant="h5" gutterBottom sx={{textDecoration:"underline"}}>
                Deductions
              </Typography>
              <Stack>
                <Item>
                  <FlexBetween>
                    <Typography> Provident Fund</Typography>
                    <Typography>
                      {" "}
                      {"\u20B9"} {employeeData.salary[0].pf}
                    </Typography>
                  </FlexBetween>
                </Item>
                <Item>
                  <FlexBetween>
                    <Typography> Lop deduction</Typography>
                    <Typography>
                      {" "}
                      {"\u20B9"} {employeeData.salary[0].lop_deduction}
                    </Typography>
                  </FlexBetween>
                </Item>
                <Item>
                  <FlexBetween>
                    <Typography> Total Deduction</Typography>
                    <Typography>
                      {"\u20B9"} {employeeData.salary[0].total_deduction}
                    </Typography>
                  </FlexBetween>
                </Item>
              </Stack>
            </Grid>
          </Grid>

          <Box display={"flex"} justifyContent={"center"}>
            <Typography
              variant="h4"
              gutterBottom
              sx={{ textDecoration: "underline" }}
            >
              Pay summary
            </Typography>
          </Box>
          <Grid container spacing={2} marginTop={0.5} marginBottom={0.5}>
          
            <Grid item xs={4}>
              <Typography>Gross Earning</Typography>
              <Divider />
              <Typography>
                {"\u20B9"} {employeeData.salary[0].net_salary}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Gross Deduction</Typography>
              <Divider />
              <Typography>
                {"\u20B9"} {employeeData.salary[0].total_deduction}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>Net Pay</Typography>
              <Divider />
              <Typography>
                {"\u20B9"} {employeeData.salary[0].total_salary}
              </Typography>
            </Grid>
          </Grid>

          <Box sx={{ mt: 1 }}>
            <Typography variant="h4" gutterBottom>
              Total salary is {"\u20B9"} {employeeData.salary[0].total_salary}
            </Typography>
          </Box>
        </Box>
<p>***** This is electronically generated document hence does not require a signature *****</p>
        {/* Download button */}
      </div>
      <Box mt={2}>
        <Button variant="contained" onClick={handleDownload}>
          Download PDF
        </Button>
      </Box>
    </Box>
  );
};

export default SlipGenerator;
