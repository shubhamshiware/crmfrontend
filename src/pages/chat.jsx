import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItemIcon,
} from "@mui/material";

const ChatApp = () => {
  const parseJwt = (token) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(base64));
    } catch (e) {
      console.error("Invalid token", e);
      return null;
    }
  };

  const [chats, setChats] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = parseJwt(token);
    setLoggedInUser(user);
    fetchChats();
    fetchUsers();
  }, []);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const { data } = await axios.get(
        "https://crmback-tjvw.onrender.com/chat",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChats(data);
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(
        "https://crmback-tjvw.onrender.com/auth/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Users fetched:", data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]); // fallback to empty array on error
    }
  };

  const handleCreateGroup = async () => {
    if (selectedUsers.length < 2) {
      alert("Please select at least 2 users to create a group chat");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.post(
        "https://crmback-tjvw.onrender.com/chat/group",
        {
          name: groupName,
          users: selectedUsers,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChats([data, ...chats]);
      setOpen(false);
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  const toggleUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchChats();
    fetchUsers();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Chats
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Group Chat
      </Button>

      <List>
        {chats.map((chat) => (
          <ListItem key={chat._id} divider>
            <ListItemText
              primary={chat.chatName || "Unnamed Chat"}
              secondary={
                chat.isGroupChat
                  ? `Group Admin: ${chat.groupAdmin?.name}`
                  : chat.users.map((u) => u.name).join(", ")
              }
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Group Chat</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            margin="normal"
          />
          <List>
            {Array.isArray(users) &&
              users
                .filter((user) => user._id !== loggedInUser?._id)
                .map((user) => (
                  <ListItem
                    key={user._id}
                    button
                    onClick={() => toggleUser(user._id)}
                  >
                    <ListItemIcon>
                      <Checkbox checked={selectedUsers.includes(user._id)} />
                    </ListItemIcon>
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleCreateGroup}
            variant="contained"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChatApp;
