import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  Typography,
  Box,
  CircularProgress,
  Avatar,
  Select,
  MenuItem,
  Button,
  TextField,
  CardContent,
  Grid,
  Card,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { jwtDecode } from "jwt-decode";
import { Divider } from "@mui/material";

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
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [user, setUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [newCtr, setCtr] = useState();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }
  }, []);

  useEffect(() => {
    if (client) {
      setNewLeads(client.leadsgenerated || 0);

      setNewFollowers(client.followers);
      setViews(client.views);
      setCtr(client.ctr);
    }
  }, [client]);

  const data = [
    { name: "Leads generated", value: newLeads },
    { name: "client thruogh rate", value: newFollowers },
    { name: " Leads Converted in %", value: newViews },
    { name: "Engagement Rate", value: newCtr },
  ];
  console.log(newCtr, "ctr");
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
    const updatedLeads = prompt(
      "Enter new number of leads:",
      client.leadsgenerated
    );
    const updatedFollowers = prompt(
      "Enter leades got converted:",
      client.followers
    );

    const updatedCtr = prompt("Enter client through rate:", client.ctr);
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
      isNaN(updatedCtr) ||
      updatedCtr < 0 ||
      isNaN(updatedViews) ||
      updatedViews < 0
    ) {
      alert("Invalid input. Please enter valid numbers.");
      return;
    }

    try {
      const response = await fetch(
        `https://crmback-tjvw.onrender.com/client/${client._id}/leads`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            leadsgenerated: updatedLeads,
            followers: updatedFollowers,
            views: updatedViews,
            ctr: updatedCtr,
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
        ctr: updatedCtr,
      }));

      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      alert("Error updating data. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    fetchUserProfile();
  }, [client?._id]);

  const fetchUserProfile = async () => {
    if (!client?._id) return;

    try {
      const res = await axios.get(
        `https://crmback-tjvw.onrender.com/client/${client._id}`
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

  const handleUpload = async () => {
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("userId", client._id);

    try {
      const res = await axios.post(
        `https://crmback-tjvw.onrender.com/client/${client._id}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (res.data.success) {
        setProfileImage(res.data.user.profileImage);
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

    setPackageAmount(newAmount);

    try {
      const response = await fetch(
        `https://crmback-tjvw.onrender.com/client/${id}/update-package`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newAmount }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update package amount");
      }

      setPaymentAmount("");
    } catch (error) {
      console.error("Error updating package amount:", error);
      alert("Error updating package amount");

      setPackageAmount(packageAmount);
    }
  };

  const handleStatusChange = async (type, itemIndex, isCompleted) => {
    try {
      const response = await fetch(
        `https://crmback-tjvw.onrender.com/client/${id}/update-status`,
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

  const generatePDF = () => {
    const input = document.getElementById("report-content");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Client_Report_${client?.name || "User"}.pdf`);
    });
  };

  return (
    <Box p={3} bgcolor="#f9f9f9" minHeight="100vh">
      <Grid container spacing={9}>
        <Grid item xs={12} md={4}>
          <Box
            bgcolor="#fff"
            boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1)"
            borderRadius="8px"
          >
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
                src={
                  preview || profileImage || "https://via.placeholder.com/150"
                }
                sx={{
                  width: 100,
                  height: 100,
                  mb: 2,
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                }}
              />

              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
                paddingleft="10px"
              >
                {(userRole === "author" || userRole === "admin") && (
                  <>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      style={{
                        marginBottom: "10px",
                        padding: "8px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        width: "100%",
                        cursor: "pointer",
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
                  </>
                )}
              </Box>
            </Box>

            <br></br>
            <Box
              sx={{
                maxWidth: 400,
                p: 3,
                m: 2,
                backgroundColor: "#fafafa",
                borderRadius: 3,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#333", fontWeight: "bold", textAlign: "center" }}
              >
                {client.company}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box display="flex" alignItems="center" mb={2}>
                <PhoneIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ color: "#555" }}>
                  {client.phone}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <EmailIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ color: "#555" }}>
                  {client.email}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mb={2}>
                <BusinessIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ color: "#555" }}>
                  Status:{" "}
                  <Box
                    component="span"
                    fontWeight="bold"
                    color="secondary.main"
                  >
                    {client.status}
                  </Box>
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ color: "#555" }}>
                  Added At:{" "}
                  <Box component="span" fontWeight="medium">
                    {new Date(client.addedAt).toLocaleDateString()}
                  </Box>
                </Typography>
              </Box>
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
              Engagement Rate: {client.views}%
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Followers Increased: {client.followers}%
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              CTR: {client.ctr}%
            </Typography>
          </Box>
          {(userRole === "author" || userRole === "admin") && (
            <>
              <Button
                variant="contained"
                color="error"
                onClick={handleLeads}
                sx={{ mt: 2 }}
              >
                Edit All
              </Button>
            </>
          )}
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
          {(userRole === "author" || userRole === "admin") && (
            <>
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
            </>
          )}
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
          <div
            id="report-content"
            style={{ margin: "30px auto", maxWidth: 700 }}
          >
            <Card
              elevation={4}
              sx={{ borderRadius: 3, padding: 3, bgcolor: "#f5f5f5" }}
            >
              <CardContent>
                {/* Company Name */}
                <Typography
                  variant="h4"
                  align="center"
                  color="primary"
                  gutterBottom
                  sx={{ fontWeight: 700 }}
                >
                  AiInfinite
                </Typography>

                {/* Report Title */}
                <Typography variant="h6" align="center" gutterBottom>
                  Monthly Performance Report
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Client Details */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">
                    <strong>Client Name:</strong>
                    {client.company}
                  </Typography>
                  <Typography variant="subtitle1">
                    <strong>Package Amount:</strong> ₹{packageAmount}
                  </Typography>
                </Box>

                {/* Metrics */}
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    🔹 <strong>Leads Generated:</strong> {newLeads}
                  </Typography>
                  <Typography variant="body1">
                    🔹 <strong>Leads Converted:</strong> {newFollowers}%
                  </Typography>
                  <Typography variant="body1">
                    🔹 <strong>Engagement Rate:</strong> {newViews}%
                  </Typography>
                  <Typography variant="body1">
                    🔹 <strong>Client through rate:</strong> {newCtr}%
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Footer */}
                <Typography variant="body2" color="text.secondary">
                  📅 Report Generated on: {new Date().toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>

            {/* Download Button */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PictureAsPdfIcon />}
                onClick={generatePDF}
                sx={{ borderRadius: 2, px: 4 }}
              >
                Download PDF Report
              </Button>
            </Box>
          </div>
        </Box>
      </Grid>
    </Box>
  );
};

export default ClientDetails;
