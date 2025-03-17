import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Button } from "@mui/material";
import Calendar from "./calender";
import { jwtDecode } from "jwt-decode";
import Salsepage from "./salse";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPackage, setTotalPackage] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); // Extract role from token
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  // console.log(token)

  useEffect(() => {
    fetch("http://localhost:8089/client/clients")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data, "dashboard page");
        setData(data.data);

        // Ensure data.data is an array before calculating total package amount
        if (Array.isArray(data.data)) {
          const total = data.data.reduce(
            (acc, client) => acc + (client.package || 0),
            0
          );
          setTotalPackage(total);
        }

        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const navigateToAdminDashboard = () => {
    navigate("/admindashboard"); // Navigate to Admin Dashboard
  };

  return (
    <>
      {userRole === "admin" && (
        <Button
          variant="contained"
          color="primary"
          onClick={navigateToAdminDashboard}
          sx={{ marginBottom: 2 }}
        >
          Admin Dashboard
        </Button>
      )}

      <Box sx={{ padding: 3 }}>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Welcome to your Dashboard</Typography>
          <Typography variant="body1" sx={{ mt: 2, color: "gray" }}>
            <Salsepage />
          </Typography>
        </Paper>

        <br />
        <br />

        <Paper
          elevation={3}
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Here is your Updates</Typography>
          <Typography variant="h6" sx={{ mt: 2, color: "green" }}>
            Total Remaining amount: ₹ {totalPackage}
          </Typography>
        </Paper>

        <Calendar />
      </Box>
    </>
  );
};

export default Dashboard;
