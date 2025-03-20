import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending login request...");

      // Make the login request
      const response = await axios.post(
        "https://crmback-tjvw.onrender.com/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Login API response:", response);

      if (response.data.message === "Login successful") {
        console.log("Login successful, routing to dashboard...");
        setMessage("Login successful!");
        setSuccess(true);

        // Reset the form
        setFormData({ email: "", password: "" });

        // Save the user token in localStorage
        const token = response.data.data.token; // Get the token
        const redirectPage = response.data.data.redirectPage;
        // console.log(redirectPage, "redireted");
        if (token) {
          localStorage.setItem("authToken", token);
          // console.log("Token saved to localStorage:", token);
        } else {
          console.warn("Token not provided in the response.");
          setMessage("Login failed. Token missing in response.");
          setSuccess(false);
          return;
        }

        // Redirect to the appropriate dashboard
        navigate(`/${redirectPage}`);
      } else {
        console.warn("Login failed. Reason:", response.data.message);
        setMessage(response.data.message || "Invalid email or password.");
        setSuccess(false);
      }
    } catch (err) {
      console.error("Error occurred during login:", err);

      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        setMessage(
          err.response.data.message || "Login failed. Please try again."
        );
      } else if (err.request) {
        console.error("No response received:", err.request);
        setMessage("No response from the server. Please try again later.");
      } else {
        console.error("Error during request setup:", err.message);
        setMessage("An error occurred. Please try again later.");
      }

      setSuccess(false);
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
          Login
        </Typography>
        {message && (
          <Alert severity={success ? "success" : "error"} sx={{ mb: 2 }}>
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
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate("/signup")}
            sx={{ textTransform: "none" }}
          >
            Sign up here
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;

//backend hosting url
//https://crmback-tjvw.onrender.com
//
//local signup url
// http://localhost:8089/auth/login
