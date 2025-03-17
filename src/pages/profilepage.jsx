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
          `http://localhost:8089/user/${loggedInUserId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response, "datas");
        // Fetch all todos
        const fetchTasks = await axios.get("http://localhost:8089/content/");
        const allTasks = fetchTasks.data?.data || []; // Update to use `data`

        // console.log("All Tasks datas", allTasks);

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
        "http://localhost:8089/content/content",
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
        "http://localhost:8089/content/edit",
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
      await axios.delete(`http://localhost:8089/content/content/${id}`);
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
      await axios.put("http://localhost:8089/content/edit", {
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
            flex={1}
          >
            <Avatar sx={{ width: 90, height: 90, mb: 2 }}>
              <AccountCircle sx={{ fontSize: 120 }} />
            </Avatar>

            <Typography variant="h6" fontWeight="bold">
              {userData?.name}
            </Typography>
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
