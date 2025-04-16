import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, Button, Divider } from "@mui/material";
import axios from "axios";

const ChatBox = ({ user }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `https://crmback-tjvw.onrender.com/user/${user._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const sendMessage = async () => {
    try {
      const { data } = await axios.post(
        "https://crmback-tjvw.onrender.com/chat",
        {
          recipientId: user._id,
          content: newMsg,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessages([...messages, data]);
      setNewMsg("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        Chat with {user.name}
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mb: 2,
          p: 1,
          backgroundColor: "#fff",
          borderRadius: "4px",
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              mb: 1,
              textAlign: msg.sender === user._id ? "left" : "right",
            }}
          >
            <Typography variant="body2">{msg.content}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatBox;
