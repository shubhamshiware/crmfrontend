import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import axios from "axios";
import ChatBox from "./chatbox";

const ChatApp = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    const token = localStorage.getItem("authToken");
    console.log(token, "Token ");
    try {
      const { data } = await axios.get(
        "https://crmback-tjvw.onrender.com/auth/",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(data, "users ");
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      {/* Left Panel - Users List */}
      <Paper
        sx={{
          width: "30%",
          height: "100%",
          overflowY: "auto",
          mr: 2,
          p: 2,
        }}
        elevation={3}
      >
        <Typography variant="h6" gutterBottom>
          Users
        </Typography>
        <List>
          {users.map((user) => (
            <React.Fragment key={user._id}>
              <ListItem
                button
                onClick={() => setSelectedUser(user)}
                selected={selectedUser?._id === user._id}
              >
                <ListItemText primary={user.name} />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Right Panel - ChatBox */}
      <Paper
        sx={{
          flexGrow: 1,
          height: "100%",
          p: 2,
        }}
        elevation={3}
      >
        {selectedUser ? (
          <ChatBox user={selectedUser} />
        ) : (
          <Typography variant="h6" color="textSecondary">
            Select a user to start chatting
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default ChatApp;
