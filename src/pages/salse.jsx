import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarTodayIcon,
} from "@mui/icons-material";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const Salsepage = () => {
  const [salesData, setSalesData] = useState({
    id: "",
    totalClients: 0,
    salesToday: 0,
    monthlySales: 0,
    yearlySales: 0,
  });

  const [editDialog, setEditDialog] = useState(false);
  const [currentEdit, setCurrentEdit] = useState({
    field: "",
    value: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://crmback-tjvw.onrender.com/salse/")
      .then((response) => {
        const fetchedData = response.data.data[0];

        if (fetchedData && fetchedData._id) {
          setSalesData({
            id: fetchedData._id,
            totalClients: fetchedData.totalClients,
            salesToday: fetchedData.salesToday,
            monthlySales: fetchedData.monthlySales,
            yearlySales: fetchedData.yearlySales,
          });
        } else {
          console.error("No data returned from backend");
        }
      })
      .catch((error) => {
        console.error("Error fetching sales data:", error);
      });
  }, []);

  const handleEdit = (field, value) => {
    const allowedFields = [
      "totalClients",
      "salesToday",
      "monthlySales",
      "yearlySales",
    ];
    if (!allowedFields.includes(field)) {
      alert(`Invalid field '${field}'`);
      return;
    }

    setCurrentEdit({ field, value });
    setEditDialog(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        id: salesData.id,
        field: currentEdit.field,
        value: currentEdit.value,
      };

      console.log("Payload sent to backend:", payload);

      const response = await fetch(
        "https://crmback-tjvw.onrender.com/salse/edit",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Result from backend:", result);

      if (!response.ok || !result.acknowledged) {
        throw new Error(result.message || "Failed to update data");
      }

      setSalesData((prev) => ({
        ...prev,
        [currentEdit.field]: currentEdit.value,
      }));

      alert(result.message || "Updated successfully");
      setEditDialog(false);
    } catch (error) {
      console.error("Error updating sales data:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "MonthlySales",
        data: [
          5000, 10000, 15000, 12000, 20000, 25000, 30000, 40000, 45000, 50000,
          55000,
        ],
        fill: false,
        borderColor: "#42a5f5",
        tension: 0.3,
      },
    ],
  };

  const dataBoxes = [
    {
      title: "totalClients",
      value: salesData.totalClients,
      icon: <PeopleIcon fontSize="large" sx={{ color: "#1e88e5" }} />,
      background: "#e3f2fd",
    },
    {
      title: "salesToday",
      value: salesData.salesToday,
      icon: <ShoppingCartIcon fontSize="large" sx={{ color: "#43a047" }} />,
      background: "#e8f5e9",
    },
    {
      title: "monthlySales",
      value: salesData.monthlySales,
      icon: <AttachMoneyIcon fontSize="large" sx={{ color: "#f9a825" }} />,
      background: "#fffde7",
    },
    {
      title: "yearlySales",
      value: salesData.yearlySales,
      icon: <CalendarTodayIcon fontSize="large" sx={{ color: "#8e24aa" }} />,
      background: "#f3e5f5",
    },
  ];

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            {dataBoxes.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 3,
                    bgcolor: item.background,
                    cursor: "pointer",
                  }}
                  onClick={() => handleEdit(item.title, item.value)}
                >
                  <Box>{item.icon}</Box>
                  <Box textAlign="right">
                    <Typography variant="h6">{item.title}</Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {item.value}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sales Graph
            </Typography>
            <Line data={chartData} />
          </Card>
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit {currentEdit.field}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={`Enter new ${currentEdit.field}`}
            value={currentEdit.value}
            onChange={(e) =>
              setCurrentEdit({ ...currentEdit, value: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Salsepage;
