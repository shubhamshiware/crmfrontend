import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(""); // Success/Error message
  const [success, setSuccess] = useState(false); // Success state for conditional UI

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to submit form data
      const response = await axios.post(
        "http://localhost:8089/auth/signup",
        formData
      );
      // console.log(response);
      // If the backend returns success, update the message and reset form
      if (response.data.message === "Success") {
        // console.log("Signup successful, routing to dashboard...");
        setMessage("Your account has been created successfully!");
        setSuccess(true);
        setFormData({ username: "", email: "", password: "" });
        navigate("/dashboard");
      } else {
        setMessage(response.data.message || "Signup failed. Please try again.");
        setSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred. Please try again later.");
      setSuccess(false); // Set error state
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          p: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>

        {/* Success/Error Alert */}
        {message && (
          <Alert
            severity={success ? "success" : "error"}
            sx={{ mb: 2 }}
            icon={success ? <CheckCircleIcon fontSize="inherit" /> : undefined}
          >
            {message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="About"
            name="about"
            value={formData.about}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default SignupPage;
