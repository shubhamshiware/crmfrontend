import React, { useEffect, useState } from "react";
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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TaskIcon from "@mui/icons-material/Task";
import PeopleIcon from "@mui/icons-material/People";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (
      !token &&
      location.pathname !== "/login" &&
      location.pathname !== "/signup"
    ) {
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const drawerContent = (
    <Box
      onClick={isMobile ? handleDrawerToggle : undefined}
      sx={{ textAlign: "center" }}
    >
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon sx={{ color: "#ffffff" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/Taskssss">
          <ListItemIcon sx={{ color: "#ffffff" }}>
            <TaskIcon />
          </ListItemIcon>
          <ListItemText primary="Task Manager" />
        </ListItem>
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
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: "#1976d2",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            Aiinfinite
          </Typography>

          {localStorage.getItem("authToken") ? (
            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                "&:hover": { backgroundColor: "#fff", color: "#1976d2" },
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
                "&:hover": { backgroundColor: "#fff", color: "#1976d2" },
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outlined"
              sx={{
                color: "#fff",
                borderColor: "#fff",
                "&:hover": { backgroundColor: "#fff", color: "#1976d2" },
              }}
              onClick={() => navigate("/signup")}
            >
              Signup
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav">
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              backgroundColor: "#1976d2",
              color: "#ffffff",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#1976d2",
              color: "#ffffff",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: "64px", // AppBar offset
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start", // Change to "center" if you want vertical centering too
          minHeight: "calc(100vh - 64px)",
          p: 3,
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1200px" }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
