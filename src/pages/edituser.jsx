import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";

const EditUserDetails = ({ userData, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    role: "",
    about: "",
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        email: userData.email || "",
        username: userData.username || "",
        role: userData.role || "",
        about: userData.about || "",
      });
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const userId = userData._id || userData.id;
      const response = await axios.put(
        `https://crmback-tjvw.onrender.com/user/edit/${userId}`,
        formData
      );
      alert("User updated successfully");
      if (onUserUpdated) onUserUpdated(response.data);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update user");
    }
  };

  return (
    <Card sx={{ mt: 4, p: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Edit User Details
        </Typography>

        <TextField
          label="Email"
          name="email"
          value={formData.email}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="Role"
          name="role"
          value={formData.role}
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="About"
          name="about"
          value={formData.about}
          fullWidth
          margin="normal"
          onChange={handleChange}
          multiline
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};

export default EditUserDetails;
