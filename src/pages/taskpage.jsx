import React, { useEffect, useState } from "react";
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
import {
  Email,
  Phone,
  AccountCircle,
  Info,
  Edit,
  Delete,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const TaskPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [averagePoints, setAveragePoints] = useState(0);
  const [performance, setPerformance] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const employee = location.state;

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (employee && employee._id) {
      setUserId(employee._id);
      setUserData(employee);
    }
  }, [employee]);

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          "https://crmback-tjvw.onrender.com/content/"
        );
        const allTasks = response.data?.data || [];

        const userTasks = allTasks.filter((task) => task.userId === userId);
        // console.log(userTasks, "todos ");

        setTasks(userTasks);
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
      } catch (err) {
        setError("Failed to fetch tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userId]);

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

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    try {
      const response = await axios.post(
        "https://crmback-tjvw.onrender.com/content/content",
        {
          userId,
          update: newTask,
        }
      );

      setTasks([...tasks, response.data.data]);

      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

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
      updateFields.points = 10;

      // Construct API payload
      const updatedPayload = {
        _id: id,
        update: updateFields,
        completed: !completed,
      };

      // Send request to API
      const response = await axios.put(
        "https://crmback-tjvw.onrender.com/content/edit",
        updatedPayload
      );

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAddTask();
  };

  const handleDeleteTask = async (id) => {
    if (userRole !== "admin") return;

    try {
      await axios.delete(
        `https://crmback-tjvw.onrender.com/content/content/${id}`
      );
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleEditClick = (index) => {
    if (userRole !== "admin") return;

    setEditIndex(index);
    setEditText(tasks[index].update);
  };

  const handleEditTask = async (index, id) => {
    if (userRole !== "admin" || !editText.trim()) return;

    try {
      await axios.put("https://crmback-tjvw.onrender.com/content/edit", {
        _id: id,
        update: editText,
      });

      const updatedTasks = [...tasks];
      updatedTasks[index].update = editText;
      setTasks(updatedTasks);
      setEditIndex(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleNavigation = () => {
    if (!userId) {
      alert("User ID is missing");
      return;
    }
    navigate("/att", { state: { userId } }); // Pass userId in state
  };

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
            Average Points
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {averagePoints}
          </Typography>
          <Typography
            variant="body1"
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
          <Typography>
            <br></br>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNavigation}
              sx={{ marginBottom: 2 }}
            >
              Attandence
            </Button>{" "}
          </Typography>
        </CardContent>
      </Card>
      <Card sx={{ width: "70%", p: 3, boxShadow: 3, borderRadius: 3 }}>
        <Box display="flex">
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
              {/* <input
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
              </Button> */}
            </Box>
          </Box>

          <Box flex={2} ml={4}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Email color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">{userData?.email}</Typography>
              </Box>
              <br></br>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {userData?.phone || "N/A"}
                </Typography>
              </Box>
              <br></br>
              <Box display="flex" alignItems="center" mb={1}>
                <Info color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1">
                  {userData?.about || "N/A"}
                </Typography>
              </Box>
              <br></br>
            </CardContent>
          </Box>
        </Box>
        <hr />

        <Box p={3}>
          <Typography variant="h4">Task Manager</Typography>

          <Box display="flex" mt={2}>
            <TextField
              fullWidth
              variant="outlined"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a new task"
              sx={{ mr: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddTask}>
              Add Task
            </Button>
          </Box>

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
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.update}
                  </Typography>
                )}

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
              </Box>
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

export default TaskPage;
