import React from "react";
import { Box, Typography, Paper } from "@mui/material";

import Salsepage from "./salse";

const Orders = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Orders Page
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Manage your Orders</Typography>
        <Typography variant="body1" sx={{ mt: 2, color: "gray" }}>
          <Salsepage />
        </Typography>
      </Paper>
    </Box>
  );
};

export default Orders;
