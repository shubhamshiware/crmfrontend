import React, { useState, useEffect } from "react";
import axios from "axios";
import { Grid, Card, Typography, Box, Paper, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Ensure this is installed: npm install jwt-decode
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Taskssss = () => {
  const [authors, setAuthors] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [userRole, setUserRole] = useState(""); // Stores user role
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role); // Extract user role from token
        console.log(userRole, "role in taskss");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://crmback-tjvw.onrender.com/auth/"
        );
        const users = response.data.data || [];

        setAuthors(users.filter((user) => user.role === "author"));
        setEmployees(users.filter((user) => user.role === "employee"));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (user) => {
    if (userRole === "admin" || userRole === "author") {
      navigate("/Taskpage", { state: user });
    } else {
      alert("You do not have permission to view this profile.");
    }
  };

  const handleEdit = (userId) => {
    console.log("Editing user:", userId);
    // Implement edit logic here
  };

  const handleDelete = (userId) => {
    console.log("Deleting user:", userId);
    // Implement delete logic here
  };

  return (
    <Box p={4} sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8" }}>
      <Typography
        variant="h3"
        textAlign="center"
        mb={3}
        fontWeight="bold"
        color="black"
      >
        Assign Tasks
      </Typography>
      <Paper
        elevation={3}
        sx={{ p: 4, maxWidth: "900px", mx: "auto", borderRadius: 3 }}
      >
        <Grid container spacing={4}>
          {/* Authors */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
              Authors
            </Typography>
            {authors.length > 0 ? (
              authors.map((user) => (
                <Card
                  key={user._id}
                  sx={{
                    p: 2,
                    mb: 2,
                    cursor:
                      userRole === "admin" || userRole === "author"
                        ? "pointer"
                        : "default",
                    transition: "0.3s",
                    backgroundColor: "white",
                    boxShadow: 3,
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: 6,
                      transform:
                        userRole === "admin" || userRole === "author"
                          ? "scale(1.03)"
                          : "none",
                    },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.about}
                    </Typography>
                  </Box>

                  {/* Show edit/delete buttons only for admins */}
                  {userRole === "admin" && (
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(user._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Card>
              ))
            ) : (
              <Typography color="textSecondary">No authors found.</Typography>
            )}
          </Grid>

          {/* Employees */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold" mb={2} color="primary">
              Employees
            </Typography>
            {employees.length > 0 ? (
              employees.map((user) => (
                <Card
                  key={user._id}
                  sx={{
                    p: 2,
                    mb: 2,
                    cursor:
                      userRole === "admin" || userRole === "author"
                        ? "pointer"
                        : "default",
                    transition: "0.3s",
                    backgroundColor: "white",
                    boxShadow: 3,
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: 6,
                      transform:
                        userRole === "admin" || userRole === "author"
                          ? "scale(1.03)"
                          : "none",
                    },
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => handleUserClick(user)}
                >
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.about}
                    </Typography>
                  </Box>

                  {/* Show edit/delete buttons only for admins */}
                  {userRole === "admin" && (
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(user._id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Card>
              ))
            ) : (
              <Typography color="textSecondary">No employees found.</Typography>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Taskssss;
