import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left: Hamburger Menu Icon */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>

        {/* Middle: App Title */}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          My App
        </Typography>

        {/* Right: Signup Button */}
        <Button
          variant="contained"
          color="primery"
          onClick={handleSignupClick}
          sx={{
            backgroundColor: "#f50057",
            "&:hover": { backgroundColor: "#c51162" },
            fontWeight: "bold",
          }}
        >
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
