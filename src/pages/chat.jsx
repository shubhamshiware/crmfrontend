// // src/components/ChatPage.js
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   Paper,
// } from "@mui/material";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { jwtDecode } from "jwt-decode";

// const socket = io("https://crmback-tjvw.onrender.com");

// const ChatApp = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [chats, setChats] = useState([]);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Decode token to get current user
//   useEffect(() => {
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setCurrentUser(decoded);
//         console.log("Decoded user:", decoded);
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }
//   }, []);

//   // Fetch chats
//   useEffect(() => {
//     if (currentUser) {
//       fetchChats();
//     }
//   }, [currentUser]);

//   useEffect(() => {
//     if (selectedChat) {
//       socket.emit("joinChat", selectedChat._id);
//     }
//   }, [selectedChat]);

//   useEffect(() => {
//     socket.on("messageReceived", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });
//   }, []);

//   const fetchChats = async () => {
//     try {
//       const { data } = await axios.post(
//         "https://crmback-tjvw.onrender.com/chats",
//         {
//           userId1: currentUser._id,
//           userId2: "OTHER_USER_ID",
//         }
//       );
//       setChats([data]); // accessChat returns a single chat, not an array
//     } catch (err) {
//       console.error("Error fetching chats:", err);
//     }
//   };

//   const fetchMessages = async (chat) => {
//     setSelectedChat(chat);
//     try {
//       const { data } = await axios.get(
//         `https://crmback-tjvw.onrender.com/message/${chat._id}`
//       );
//       setMessages(data);
//     } catch (err) {
//       console.error("Error fetching chats:", err);
//     }
//   };

//   const sendMessage = async () => {
//     const message = newMessage();
//     console.log(message, "incomming messages");
//     if (!newMessage || !selectedChat || !currentUser) return;

//     try {
//       const { data } = await axios.post(
//         "https://crmback-tjvw.onrender.com/message",
//         {
//           content: newMessage,
//           chatId: selectedChat._id,
//           senderId: currentUser._id,
//         }
//       );

//       socket.emit("newMessage", data);
//       setMessages([...messages, data]);
//       setNewMessage("");
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };

//   return (
//     <Box display="flex" height="100vh" p={2}>
//       {/* Sidebar Chat List */}
//       <Box width="30%" pr={2}>
//         <Typography variant="h5" gutterBottom>
//           Chats
//         </Typography>
//         <List component={Paper}>
//           {chats.length === 0 ? (
//             <Typography variant="body2" p={2}>
//               No chats found
//             </Typography>
//           ) : (
//             chats.map((chat) => (
//               <ListItem
//                 button
//                 key={chat._id}
//                 selected={selectedChat?._id === chat._id}
//                 onClick={() => fetchMessages(chat)}
//               >
//                 {chat.chatName || "Unnamed Chat"}
//               </ListItem>
//             ))
//           )}
//         </List>
//       </Box>

//       {/* Main Chat Window */}
//       <Box flex={1} display="flex" flexDirection="column">
//         <Typography variant="h5" gutterBottom>
//           {selectedChat?.chatName || "Select a Chat"}
//         </Typography>

//         <Box flex={1} overflow="auto" component={Paper} p={2} mb={2}>
//           {messages.map((msg) => (
//             <Box
//               key={msg._id}
//               textAlign={msg.sender._id === currentUser?._id ? "right" : "left"}
//               mb={1}
//             >
//               <Typography variant="body2">
//                 <strong>{msg.sender.name}</strong>: {msg.content}
//               </Typography>
//             </Box>
//           ))}
//         </Box>

//         <Box display="flex">
//           <TextField
//             fullWidth
//             placeholder="Type your message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <Button variant="contained" onClick={sendMessage} sx={{ ml: 1 }}>
//             Senda
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ChatApp;
