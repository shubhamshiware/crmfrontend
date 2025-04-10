import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
// import { jwtDecode } from "jwt-decode";

const Editclient = () => {
  const { id } = useParams(); // Extract client ID from the URL
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       setUserRole(decoded.role);
  //     } catch (error) {
  //       console.error("Error decoding token:", error);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(
          `https://crmback-tjvw.onrender.com/client/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch client details");
        }

        const result = await response.json();
        setClient(result.data); // Ensure `data` is the correct key
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const handleSave = async () => {
    try {
      const response = await fetch(
        "https://crmback-tjvw.onrender.com/client/edit",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: client._id, ...client }), // Include `_id` in the payload
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update client details");
      }

      const result = await response.json();
      alert(result.message || "Client updated successfully");
      navigate("/clients"); // Redirect to the clients list
    } catch (error) {
      alert("Error updating client: " + error.message);
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
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!client) {
    return <Typography>No client data found!</Typography>;
  }

  return (
    <Box m={2}>
      <Typography variant="h4" gutterBottom>
        Edit Client
      </Typography>
      <TextField
        label="Company"
        value={client.company || ""}
        onChange={(e) => setClient({ ...client, company: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Phone"
        value={client.phone || ""}
        onChange={(e) => setClient({ ...client, phone: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="package"
        value={client.package || ""}
        onChange={(e) => setClient({ ...client, package: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="status"
        value={client.status || ""}
        onChange={(e) => setClient({ ...client, status: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email"
        value={client.email || ""}
        onChange={(e) => setClient({ ...client, email: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="leadsgenerated"
        value={client.leadsgenerated || ""}
        onChange={(e) =>
          setClient({ ...client, leadsgenerated: e.target.value })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="followers"
        value={client.followers || ""}
        onChange={(e) => setClient({ ...client, followers: e.target.value })}
        fullWidth
        margin="normal"
      />
      <TextField
        label="views"
        value={client.views || ""}
        onChange={(e) => setClient({ ...client, views: e.target.value })}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ marginTop: "16px" }}
      >
        Save
      </Button>
    </Box>
  );
};

export default Editclient;
