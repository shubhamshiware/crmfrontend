import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  CircularProgress,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      const decoded = jwtDecode(token);
      setUserRole(decoded.role);
    }
  }, []);

  const fetchClients = async () => {
    setLoading(true);
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

      setClients(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        const response = await fetch(
          "https://crmback-tjvw.onrender.com/client/delete",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ id }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete client");
        }
        const result = await response.json();
        alert(result.message);
        fetchClients();
      } catch (error) {
        alert("Error deleting client: " + error.message);
      }
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

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

  if (!Array.isArray(clients)) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error: Data is not an array.
        </Typography>
      </Box>
    );
  }

  const columns = [
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      renderCell: (params) => (
        <Button
          color="primary"
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": { backgroundColor: "#115293" },
          }}
          onClick={() => navigate(`/clientdetails/${params.row.id}`)}
        >
          {params.value}
        </Button>
      ),
    },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "addedAt",
      headerName: "Date",
      flex: 1,
      valueFormatter: (params) => {
        new Date(clients.addedAt).toLocaleDateString();
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) =>
        userRole === "author" || userRole === "admin" ? (
          <Box>
            <IconButton
              color="primary"
              onClick={() => navigate(`/editclient/${params.row.id}`)}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No actions Allowed
          </Typography>
        ),
    },
  ];

  const rows = clients.map((client) => ({
    id: client._id,
    company: client.company,
    phone: client.phone,
    email: client.email,
    status: client.status,
    addedAt: client.addedAt,
  }));

  return (
    <Box m={2}>
      <Typography variant="h4" gutterBottom>
        Clients List
      </Typography>
      {(userRole === "author" || userRole === "admin") && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/addclients")}
          sx={{ marginBottom: "16px" }}
        >
          Add Client
        </Button>
      )}

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

export default Clients;
