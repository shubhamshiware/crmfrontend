// export default AdminDashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const { id } = useParams();

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://crmback-tjvw.onrender.com/auth/"
      );
      setUsers(response.data.data); // Access the correct array
      // console.log(response.data.data, "ress");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle role change and send update to backend
  const handleRoleChange = async (event, user) => {
    const updatedRole = event.target.value;
    console.log(updatedRole, "roleupdate");

    try {
      await axios.put("https://crmback-tjvw.onrender.com/auth/edit", {
        id: user._id,
        role: updatedRole,
      });
      console.log(id);

      // Update local state
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === user._id ? { ...u, role: updatedRole } : u
        )
      );

      alert("Role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role.");
    }
  };

  return (
    <div>
      <h1 style={{ color: "#DC143C" }}>Admin Dashboard</h1>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>About</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.about}</TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={user.role}
                      onChange={(event) => handleRoleChange(event, user)}
                    >
                      <MenuItem value="employee">Employee</MenuItem>
                      <MenuItem value="author">Author</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminDashboard;
