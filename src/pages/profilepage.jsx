import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Checkbox,
  Button,
  IconButton,
} from "@mui/material";
import { Email, Phone, Info, Edit, Delete } from "@mui/icons-material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import BadgeIcon from "@mui/icons-material/Badge";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedText, setUpdatedText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [userId, setUserId] = useState(null);
  const [averagePoints, setAveragePoints] = useState(0);
  const [performance, setPerformance] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        const loggedInUserId = decodedToken?.id;
        setUserId(loggedInUserId);

        if (!loggedInUserId) {
          setError("Invalid token data.");
          setLoading(false);
          return;
        }

        // Fetch user details
        const response = await axios.get(
          `https://crmback-tjvw.onrender.com/user/${loggedInUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch all todos
        const fetchTasks = await axios.get(
          "https://crmback-tjvw.onrender.com/content/"
        );
        const allTasks = fetchTasks.data?.data || []; // Update to use `data`

        //  Filter tasks where `task.userId === loggedInUserId`
        const userTasks = allTasks.filter(
          (task) => task.userId === loggedInUserId
        );
        const totalPoints = userTasks.reduce(
          (sum, task) => sum + (task.points || 0),
          0
        );
        const avg =
          userTasks.length > 0
            ? (totalPoints / userTasks.length).toFixed(2)
            : 0;

        setAveragePoints(avg);
        if (avg > 8) {
          setPerformance("Good Performance");
        } else if (avg >= 6) {
          setPerformance("Average Performance");
        } else {
          setPerformance("Needs Improvement");
        }
        setTasks(userTasks);
        setUserData(response.data.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId) return; // ✅ Ensures the effect only runs when userId is available

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `https://crmback-tjvw.onrender.com/user/${userId}`
        );

        if (res.data?.success && res.data.data?.profileImage) {
          setProfileImage(res.data.data.profileImage);
        }
      } catch (error) {
        console.error(
          "Error fetching user:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  //add new task
  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(
        "https://crmback-tjvw.onrender.com/content/content",
        {
          userId: userId, // Send userId (fetch from auth context or state)
          update: newTask,
        }
      );

      setTasks([...tasks, response.data.data]); // Update UI
      setNewTask(""); // Clear input field
      // console.log(tasks, "task");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  //Here we are Toggaling The Task
  const handleToggleTask = async (
    index,
    id,
    completed,
    description,
    assignedTo
  ) => {
    try {
      // Construct update fields
      const updateFields = {};
      if (description) updateFields.description = description;
      if (assignedTo) updateFields.assignedTo = assignedTo;

      // Ensure update is always an object (never null)
      updateFields.points = 10; // Example points to add per task completion

      // Construct API payload
      const updatedPayload = {
        _id: id,
        update: updateFields,
        completed: !completed, // Toggle completion status
      };

      console.log(" Sending Payload:", updatedPayload);

      // Send request to API
      const response = await axios.put(
        "https://crmback-tjvw.onrender.com/content/edit",
        updatedPayload
      );

      // console.log(" Updated Task Response:", response.data);

      // Update UI only if API is successful
      const updatedTasks = [...tasks];
      updatedTasks[index] = { ...updatedTasks[index], completed: !completed };
      setTasks(updatedTasks);
    } catch (error) {
      console.error(
        "❌ Error updating task:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(
        `https://crmback-tjvw.onrender.com/content/content/${id}`
      );
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Enable edit mode
  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditText(tasks[index].update);
  };

  const handleEditTask = async (index, id) => {
    if (!editText.trim()) return;
    try {
      await axios.put("https://crmback-tjvw.onrender.com/content/edit", {
        _id: id,
        update: editText,
      });
      const updatedTasks = [...tasks];
      updatedTasks[index].update = editText;
      setTasks(updatedTasks);
      // console.log(tasks, "example");
      setEditIndex(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show preview before upload
  };

  // ✅ Handle Image Upload
  const handleUpload = async () => {
    if (!image) return alert("Please select an image");
    // console.log(userId, "Uploading:");
    // const decodedToken = jwtDecode(token);
    // const loggedInUserId = decodedToken?.id;

    const formData = new FormData();
    formData.append("image", image);
    formData.append("userid", userId);

    try {
      const res = await axios.post(
        `https://crmback-tjvw.onrender.com/${userId}/imgupload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      // console.log(res);
      if (res.data.success) {
        setProfileImage(res.data.data); // ✅ Update image after upload
        alert("Profile image updated!");
      } else {
        alert("Upload failed!");
      }
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
      alert("Image upload failed!");
    }
  };

  //logged in profile page

  return (
    <Box display="flex" justifyContent="center" mt={5}>
      <Card
        sx={{
          maxWidth: 300,
          m: 2,
          p: 2,
          backgroundColor: "#f5f5f5",
          textAlign: "center",
        }}
      >
        <CardContent>
          <Typography variant="h6" color="primary">
            Earned Points
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {averagePoints}
          </Typography>
          <Typography
            variant="body3"
            color={
              performance === "Good Performance"
                ? "green"
                : performance === "Average Performance"
                  ? "orange"
                  : "red"
            }
          >
            {performance}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ width: "70%", p: 3, boxShadow: 3, borderRadius: 3 }}>
        <Box display="flex">
          {/* Left - Profile Avatar */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            flex={1}
            p={3}
            sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <Avatar
              src={preview || profileImage || "https://via.placeholder.com/150"}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            />

            <Typography variant="h6" fontWeight="bold" mb={2}>
              {userData?.name}
            </Typography>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
            >
              <input
                type="file"
                onChange={handleImageChange}
                style={{
                  marginBottom: "10px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  width: "100%",
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                sx={{
                  textTransform: "none",
                  borderRadius: "6px",
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "8px 16px",
                }}
              >
                Upload
              </Button>
            </Box>
          </Box>

          {/* Right - User Details */}
          <Box flex={2} ml={4}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" fontWeight="bold">
                  {userData?.email}
                </Typography>
              </Box>
              <br></br>
              <Box display="flex" alignItems="center" mb={1}>
                <BadgeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" fontWeight="bold">
                  {userData?.role || "N/A"}
                </Typography>
              </Box>
              <br></br>
              <Box display="flex" alignItems="center" mb={1}>
                <Info color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" fontWeight="bold">
                  {userData?.about || "N/A"}
                </Typography>
              </Box>
              <br></br>
              <Box display="flex" alignItems="center" mb={1}>
                <AccountCircle color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" fontWeight="bold">
                  {userData?.username || "N/A"}
                </Typography>
              </Box>
            </CardContent>
          </Box>
        </Box>
        <hr></hr>

        <Box p={3}>
          <Typography variant="h4">Task Manager</Typography>

          {/* Add Task Input */}
          {userData?.role === "admin" && (
            <Box mt={3}>
              <TextField
                fullWidth
                value={newTask}
                onKeyDown={handleKeyDown}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add Task"
              />
              <Button onClick={handleAddTask}>Add Task</Button>
            </Box>
          )}

          {/* Task List */}
          <Box mt={3}>
            {tasks.map((task, index) => (
              <Box key={task._id} display="flex" alignItems="center" mt={1}>
                <Checkbox
                  checked={task.completed || false}
                  onChange={() =>
                    handleToggleTask(index, task._id, task.completed)
                  }
                  sx={{
                    color: task.completed ? "green" : "gray",
                    "&.Mui-checked": {
                      color: "green",
                    },
                  }}
                />
                <>
                  {editIndex === index ? (
                    <TextField
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      sx={{ flexGrow: 1 }}
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{
                        flexGrow: 1,
                        textDecoration: task.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {task.update}
                    </Typography>
                  )}

                  {/* ✅ Only Admin Can Edit/Delete */}
                  {userData?.role === "admin" && (
                    <>
                      {editIndex === index ? (
                        <Button
                          color="primary"
                          onClick={() => handleEditTask(index, task._id)}
                        >
                          Save
                        </Button>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(index)}
                          >
                            <Edit />
                          </IconButton>

                          <IconButton
                            color="error"
                            onClick={() => handleDeleteTask(task._id)}
                          >
                            <Delete />
                          </IconButton>
                        </>
                      )}
                    </>
                  )}
                </>
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default ProfilePage;
