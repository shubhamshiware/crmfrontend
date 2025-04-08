import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = ({ toggleSidebar }) => {
  Const[(client, setClient)] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [server, setServer] = useState("");

  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate("/signup");
  };

  useEffect(() => {
    const handelServer = async (id, index) => {
      try {
        await axios.get("https://crmback-tjvw.onrender.com/content/edit", {
          _id: id,
        });
        const data = setServer([...data]);
      } catch (err) {
        console.error("error while starting server", err);
      }
    };
  });

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
