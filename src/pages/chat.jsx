import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://crmback-tjvw.onrender.com"); // replace with your backend URL

const ChatApp = () => {
  const [user, setUser] = useState({ _id: "user1", name: "User One" }); // Dummy user
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchChats();
    socket.emit("setup", user);
    socket.on("message received", (newMsg) => {
      if (newMsg.chat._id === selectedChat?._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
  }, [selectedChat]);

  const fetchChats = async () => {
    const { data } = await axios.get("https://crmback-tjvw.onrender.com/chat");
    setChats(data);
  };

  const fetchMessages = async (chatId) => {
    const { data } = await axios.get(
      `https://crmback-tjvw.onrender.com/${chatId}`
    );
    setMessages(data);
    setSelectedChat(chats.find((c) => c._id === chatId));
    socket.emit("join chat", chatId);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const { data } = await axios.post(
      "https://crmback-tjvw.onrender.com/message",
      {
        content: newMessage,
        chatId: selectedChat._id,
        sender: user._id,
      }
    );
    socket.emit("new message", data);
    setMessages([...messages, data]);
    setNewMessage("");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", p: 2, gap: 2 }}>
      <Paper sx={{ width: "30%", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Chats
        </Typography>
        <List>
          {chats.map((chat) => (
            <ListItem
              button
              key={chat._id}
              onClick={() => fetchMessages(chat._id)}
            >
              <ListItemText primary={chat.chatName} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper
        sx={{ flexGrow: 1, p: 2, display: "flex", flexDirection: "column" }}
      >
        <Typography variant="h6">
          {selectedChat ? selectedChat.chatName : "Select a chat"}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Box sx={{ flexGrow: 1, overflowY: "auto", mb: 2 }}>
          {messages.map((msg, index) => (
            <Typography
              key={index}
              sx={{
                my: 1,
                backgroundColor:
                  msg.sender === user._id ? "#e1f5fe" : "#fce4ec",
                p: 1.5,
                borderRadius: 1,
              }}
            >
              <strong>{msg.sender === user._id ? "You" : msg.sender}</strong>:{" "}
              {msg.content}
            </Typography>
          ))}
        </Box>
        {selectedChat && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              label="Type a message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ChatApp;
