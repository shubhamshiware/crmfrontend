import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const Addclients = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newClient, setNewClient] = useState({
    company: "",
    email: "",
    phone: "",
    date: "",
    package: "",
    status: "active", // Default status
    address: "",
    description: "",
    leadsgenerated: 0,
    videos: [],
    designs: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch clients from the API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          "https://crmback-tjvw.onrender.com/client/clients",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }
        const result = await response.json();
        setClients(result.data); // Assuming `data` contains an array of clients
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prevClient) => ({
      ...prevClient,
      [name]: value,
    }));
  };

  // Handle dynamic field updates
  const handleDynamicChange = (type, index, field, value) => {
    setNewClient((prevClient) => {
      const updatedField = [...prevClient[type]];
      updatedField[index][field] = value;
      return { ...prevClient, [type]: updatedField };
    });
  };

  const addDynamicField = (type) => {
    setNewClient((prevClient) => ({
      ...prevClient,
      [type]: [
        ...prevClient[type],
        { [`${type}Number`]: "", isCompleted: false },
      ],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://crmback-tjvw.onrender.com/client/clients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClient),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add client");
      }

      const addedClient = await response.json();
      setClients((prevClients) => [addedClient.data, ...prevClients]); // Add the new client to the list
      setNewClient({
        company: "",
        email: "",
        phone: "",
        date: "",
        package: "",
        status: "active",
        leadsgenerated: 0,
        followers: 0,
        address: "",
        description: "",
        videos: [],
        designs: [],
      }); // Reset form
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  const columns = [
    { field: "company", headerName: "Company", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    { field: "leadsgenerated", headerName: "leadsgenerated", flex: 1 },
    {
      field: "addedAt",
      headerName: "Date",
      flex: 1,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  const rows = clients.map((client, index) => ({
    id: index + 1,
    company: client.company,
    phone: client.phone,
    email: client.email,
    package: client.package,
    date: client.date,
    leadsgenerated: client.leadsgenerated,

    status: client.status,
    addedAt: client.addedAt,
  }));

  return (
    <Box m={2}>
      <Typography variant="h4" gutterBottom>
        Clients List
      </Typography>

      {/* Form to add a new client */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          marginBottom: 3,
        }}
      >
        <TextField
          label="Company"
          name="company"
          value={newClient.company}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={newClient.email}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={newClient.phone}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Date"
          name="date"
          type="date"
          value={newClient.date}
          onChange={handleInputChange}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Package"
          name="package"
          value={newClient.package}
          onChange={handleInputChange}
          required
        />
        <TextField
          label="Address"
          name="address"
          value={newClient.address}
          onChange={handleInputChange}
        />
        <TextField
          label="Leadsgenerated"
          name="leadsgenerated"
          value={newClient.leadsgenerated}
          onChange={handleInputChange}
        />

        {/* Videos Section */}
        <Typography variant="h6">Videos</Typography>
        {newClient.videos.map((video, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1}>
            <TextField
              label="Video Number"
              value={video.videoNumber}
              onChange={(e) =>
                handleDynamicChange(
                  "videos",
                  index,
                  "videoNumber",
                  e.target.value
                )
              }
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={video.isCompleted}
                  onChange={(e) =>
                    handleDynamicChange(
                      "videos",
                      index,
                      "isCompleted",
                      e.target.checked
                    )
                  }
                />
              }
              label="Completed"
            />
          </Box>
        ))}
        <IconButton onClick={() => addDynamicField("videos")}>
          <AddCircleOutlineIcon />
        </IconButton>

        {/* Designs Section */}
        <Typography variant="h6">Designs</Typography>
        {newClient.designs.map((design, index) => (
          <Box key={index} display="flex" alignItems="center" gap={1}>
            <TextField
              label="Design Number"
              value={design.designNumber}
              onChange={(e) =>
                handleDynamicChange(
                  "designs",
                  index,
                  "designNumber",
                  e.target.value
                )
              }
              required
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={design.isCompleted}
                  onChange={(e) =>
                    handleDynamicChange(
                      "designs",
                      index,
                      "isCompleted",
                      e.target.checked
                    )
                  }
                />
              }
              label="Completed"
            />
          </Box>
        ))}
        <IconButton onClick={() => addDynamicField("designs")}>
          <AddCircleOutlineIcon />
        </IconButton>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Add Client"}
        </Button>
      </Box>

      {/* Clients Table */}
      <Box
        sx={{
          height: 400,
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Addclients;
