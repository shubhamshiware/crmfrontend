import React, { useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TaskIcon from "@mui/icons-material/Task";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Check for token and handle unauthorized access
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    // console.log("Token retrieved from localStorage:", token);

    // Allow access to the login and signup pages without a token
    if (
      !token &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup"
    ) {
      navigate("/login"); // Redirect to login if token doesn't exist and not on login/signup
    }
  }, [navigate, location.pathname]);

  // Handle Login Button (Redirect to Login Page)
  const handleLogin = () => {
    navigate("/login");
  };

  // Handle Signup Button (Redirect to Signup Page)
  const handleSignup = () => {
    navigate("/signup");
  };

  // Handle Logout Functionality
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Header Section */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1976d2", // Matching sidebar color
        }}
      >
        <Toolbar>
          {/* Menu Icon */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 2 }}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography
            variant="h6"
            noWrap
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Aiinfinite
          </Typography>

          {/* Conditional Buttons */}
          {localStorage.getItem("authToken") ? (
            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#1976d2",
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : location.pathname === "/signup" ? (
            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#1976d2",
                },
              }}
              onClick={handleLogin}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  backgroundColor: "#fff",
                  color: "#1976d2",
                },
              }}
              onClick={handleSignup}
            >
              Signup
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Section */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1976d2", // Primary blue background
            color: "#ffffff", // White text
          },
        }}
      >
        <Toolbar />
        <List>
          {/* Dashboard */}
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon sx={{ color: "#ffffff" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          {/* Orders */}
          <ListItem button component={Link} to="/Taskssss">
            <ListItemIcon sx={{ color: "#ffffff" }}>
              <TaskIcon />
            </ListItemIcon>
            <ListItemText primary="Task Manager" />
          </ListItem>

          {/* Clients */}
          <ListItem button component={Link} to="/clients">
            <ListItemIcon sx={{ color: "#ffffff" }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Clients" />
          </ListItem>

          <ListItem button component={Link} to="/profilepage">
            <ListItemIcon sx={{ color: "#ffffff" }}>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Section */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          marginTop: "64px", // Offset for fixed AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
