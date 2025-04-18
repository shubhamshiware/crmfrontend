// src/components/ChatPage.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const socket = io("https://crmback-tjvw.onrender.com");

const ChatApp = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from token
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
        console.log(decoded, "decoded user");
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      socket.emit("joinChat", selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    socket.on("messageReceived", (message) => {
      setMessages((prev) => [...prev, message]);
    });
  }, []);

  const fetchUsers = async () => {
    const { data } = await axios.get("https://crmback-tjvw.onrender.com/auth/");
    // exclude current user
    const otherUsers = data.filter((u) => u._id !== currentUser._id);
    setAllUsers(otherUsers);
  };

  const fetchChats = async () => {
    const { data } = await axios.get("https://crmback-tjvw.onrender.com/chat");
    setChats(data);
  };

  const fetchMessages = async (chat) => {
    setSelectedChat(chat);
    const { data } = await axios.get(
      `https://crmback-tjvw.onrender.com/message/${chat._id}`
    );
    setMessages(data);
  };

  const sendMessage = async () => {
    if (!newMessage || !currentUser) return;

    const { data } = await axios.post(
      "https://crmback-tjvw.onrender.com/message",
      {
        content: newMessage,
        chatId: selectedChat._id,
        senderId: currentUser._id,
      }
    );

    socket.emit("newMessage", data);
    setMessages([...messages, data]);
    setNewMessage("");
  };

  return (
    <Box display="flex" height="100vh" p={2}>
      {/* Sidebar Chat List */}
      <Box width="30%" pr={2}>
        <Typography variant="h5" gutterBottom>
          Chats
        </Typography>
        <List component={Paper}>
          {chats.map((chat) => (
            <ListItem
              button
              key={chat._id}
              selected={selectedChat?._id === chat._id}
              onClick={() => fetchMessages(chat)}
            >
              {chat.chatName || "Unnamed Chat"}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Chat Window */}
      <Box flex={1} display="flex" flexDirection="column">
        <Typography variant="h5" gutterBottom>
          {selectedChat?.chatName || "Select a Chat"}
        </Typography>

        <Box flex={1} overflow="auto" component={Paper} p={2} mb={2}>
          {messages.map((msg) => (
            <Box
              key={msg._id}
              textAlign={msg.sender._id === currentUser?._id ? "right" : "left"}
              mb={1}
            >
              <Typography variant="body2">
                <strong>{msg.sender.name}</strong>: {msg.content}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box display="flex">
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button variant="contained" onClick={sendMessage} sx={{ ml: 1 }}>
            Send
          </Button>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Start New Chat</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select a user</InputLabel>
            <Select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              label="Select a user"
            >
              {allUsers.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={createChat} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatApp;
