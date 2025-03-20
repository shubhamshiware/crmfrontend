import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Select,
  MenuItem,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const ClientDetails = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [packageAmount, setPackageAmount] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [newLeads, setNewLeads] = useState();
  const [newFollowers, setNewFollowers] = useState();
  const [newViews, setViews] = useState();
  // const isPackageSet = useRef(false);

  // const leads = client.leadsgenerated;
  useEffect(() => {
    if (client) {
      setNewLeads(client.leadsgenerated || 0); // Ensure default value

      setNewFollowers(client.followers);
      setViews(client.views);
      console.log(newFollowers, "leads");
    }
  }, [client]); // Runs only when `client` changes

  const data = [
    { name: "Leads generated", value: newLeads },
    { name: "newfollowers", value: newFollowers },
    { name: " Leads Converted in %", value: newViews },
    { name: "Sales", value: 100 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://crmback-tjvw.onrender.com/client/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch client details");
        }
        const data = await response.json();
        // console.log(data, "client detalis");

        setClient(data.data);
        setPackageAmount(data.data.package);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id]);
  const handleLeads = async () => {
    // Prompt user to enter new values
    const updatedLeads = prompt(
      "Enter new number of leads:",
      client.leadsgenerated
    );
    const updatedFollowers = prompt(
      "Enter leades got converted:",
      client.followers
    );
    const updatedViews = prompt("Enter new number of views:", client.views);

    // Validate inputs
    if (
      updatedLeads === null ||
      isNaN(updatedLeads) ||
      updatedLeads < 0 ||
      updatedFollowers === null ||
      isNaN(updatedFollowers) ||
      updatedFollowers < 0 ||
      updatedViews === null ||
      isNaN(updatedViews) ||
      updatedViews < 0
    ) {
      alert("Invalid input. Please enter valid numbers.");
      return;
    }

    try {
      const response = await fetch(
        `https://crmback-tjvw.onrender.com/${client._id}/leads`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadsgenerated: updatedLeads,
            followers: updatedFollowers,
            views: updatedViews,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      // Update state (UI update)
      setClient((prev) => ({
        ...prev,
        leadsgenerated: updatedLeads,
        followers: updatedFollowers,
        views: updatedViews,
      }));

      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data. Please try again.");
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentAmount(event.target.value);
  };
  const handleUpdatePackage = async (operation) => {
    if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
      alert("Enter a valid payment amount!");
      return;
    }

    let newAmount;
    if (operation === "subtract") {
      newAmount = packageAmount - parseFloat(paymentAmount);
      if (newAmount < 0) {
        alert("Payment exceeds package amount!");
        return;
      }
    } else if (operation === "add") {
      newAmount = packageAmount + parseFloat(paymentAmount);
    }

    try {
      const response = await fetch(
        `https://crmback-tjvw.onrender.com/${id}/update-package`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newAmount }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update package amount");
      }

      setPackageAmount(newAmount);
      setPaymentAmount("");
    } catch (error) {
      console.error("Error updating package amount:", error);
      alert("Error updating package amount");
    }
  };

  const handleStatusChange = async (type, itemIndex, isCompleted) => {
    try {
      const response = await fetch(
        `https://crmback-tjvw.onrender.com/${id}/update-status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, itemIndex, isCompleted }),
        }
      );

      const data = await response.json();

      if (response.ok && data.data) {
        setClient(data.data);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  }

  return (
    <Box p={3} bgcolor="#f9f9f9" minHeight="100vh">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box
            p={3}
            bgcolor="#fff"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            borderRadius="8px"
          >
            <Avatar
              src={"https://via.placeholder.com/150"}
              alt={client.company}
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            />
            <Typography variant="h5" gutterBottom>
              {client.company}
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <PhoneIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">{client.phone}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <EmailIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">{client.email}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <BusinessIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">Status: {client.status}</Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                Added At: {new Date(client.addedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          {/* Videos Section */}
          <Box mb={3}>
            <Typography variant="h5" gutterBottom>
              Videos
            </Typography>
            <Grid container spacing={2}>
              {Array.from({ length: 4 }, (_, i) => (
                <Grid item xs={6} sm={3} key={`video-${i}`}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor={client.videos?.[i]?.isCompleted ? "green" : "red"}
                    color="white"
                    height="150px"
                    borderRadius="8px"
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                    p={2}
                    textAlign="center"
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Typography variant="body2" mb={1}>
                      Video {i + 1}
                    </Typography>
                    <Select
                      value={
                        client.videos?.[i]?.isCompleted
                          ? "Completed"
                          : "Not Completed"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          "video",
                          i,
                          e.target.value === "Completed"
                        )
                      }
                      sx={{
                        color: "white",
                        "& .MuiSelect-icon": {
                          color: "white",
                        },
                      }}
                    >
                      <MenuItem value="Not Completed">Not Completed</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Designs Section */}
          <Box>
            <Typography variant="h5" gutterBottom>
              Designs
            </Typography>
            <Grid container spacing={2}>
              {Array.from({ length: 4 }, (_, i) => (
                <Grid item xs={6} sm={3} key={`design-${i}`}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor={client.designs?.[i]?.isCompleted ? "green" : "red"}
                    color="white"
                    height="150px"
                    borderRadius="8px"
                    boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
                    p={2}
                    textAlign="center"
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Typography variant="body2" mb={1}>
                      Design {i + 1}
                    </Typography>
                    <Select
                      value={
                        client.designs?.[i]?.isCompleted
                          ? "Completed"
                          : "Not Completed"
                      }
                      onChange={(e) =>
                        handleStatusChange(
                          "design",
                          i,
                          e.target.value === "Completed"
                        )
                      }
                      sx={{
                        color: "white",
                        "& .MuiSelect-icon": {
                          color: "white",
                        },
                      }}
                    >
                      <MenuItem value="Not Completed">Not Completed</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <br></br>
      <Grid item xs={12} md={8}>
        <Box
          p={3}
          bgcolor="#fff"
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          borderRadius="8px"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            gap={3}
          >
            <Typography variant="body1" fontWeight="bold">
              Leads Generated: {client.leadsgenerated}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Leads Converted: {client.views}%
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Followers Increased: {client.followers}%
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="error"
            onClick={handleLeads}
            sx={{ mt: 2 }}
          >
            Edit All
          </Button>
        </Box>

        <br></br>
        <Box
          p={3}
          bgcolor="#fff"
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
          borderRadius="8px"
        >
          <Box display="flex" alignItems="center" mb={2}>
            <BusinessIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Remaining Amount: {client.package}
            </Typography>
          </Box>
          <Typography variant="h5" gutterBottom>
            Update Payment
          </Typography>

          <TextField
            label="Payment Amount"
            variant="outlined"
            fullWidth
            type="number"
            value={paymentAmount}
            onChange={handlePaymentChange}
            sx={{ mb: 2 }}
          />

          <Box display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="error"
              onClick={() => handleUpdatePackage("subtract")}
            >
              Deduct Payment
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpdatePackage("add")}
            >
              Add Payment
            </Button>
          </Box>
          <Box display="flex" justifyContent="center" alignItems="center">
            <PieChart width={500} height={400}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default ClientDetails;
