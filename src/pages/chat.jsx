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

  // 👇 For one-on-one chat
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setUsers([]);
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
        { name: groupName, users: selectedUsers },
        { headers: { Authorization: `Bearer ${token}` } }
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

  const startPrivateChat = async (user) => {
    setSelectedChatUser(user);
    setMessages([]); // Reset current messages

    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.get(
        `https://crmback-tjvw.onrender.com/message/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(data);
    } catch (err) {
      console.error("Failed to load private messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      const { data } = await axios.post(
        "https://crmback-tjvw.onrender.com/message/send",
        {
          recipientId: selectedChatUser._id,
          content: newMessage,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages((prev) => [...prev, data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Chats
      </Typography>

      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Create Group Chat
      </Button>

      <Box display="flex" gap={4} mt={2}>
        {/* Chat List */}
        <Box width="40%">
          <Typography variant="h6">All Users</Typography>
          <List>
            {users
              .filter((user) => user._id !== loggedInUser?._id)
              .map((user) => (
                <ListItem
                  button
                  key={user._id}
                  onClick={() => startPrivateChat(user)}
                  selected={selectedChatUser?._id === user._id}
                >
                  <ListItemText primary={user.name} />
                </ListItem>
              ))}
          </List>
        </Box>

        {/* Message Area */}
        <Box width="60%">
          <Typography variant="h6">
            {selectedChatUser
              ? `Chat with ${selectedChatUser.name}`
              : "Select a user to start chat"}
          </Typography>
          <Box
            border="1px solid #ccc"
            borderRadius="8px"
            p={2}
            minHeight="300px"
            maxHeight="300px"
            overflow="auto"
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                textAlign={msg.sender === loggedInUser._id ? "right" : "left"}
              >
                <Typography variant="body2">
                  <strong>
                    {msg.senderName ||
                      (msg.sender === loggedInUser._id
                        ? "You"
                        : selectedChatUser.name)}
                    :
                  </strong>{" "}
                  {msg.content}
                </Typography>
              </Box>
            ))}
          </Box>

          {selectedChatUser && (
            <Box display="flex" mt={2}>
              <TextField
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                label="Type a message"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={sendMessage}
                sx={{ ml: 1 }}
              >
                Send
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Group Dialog */}
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
