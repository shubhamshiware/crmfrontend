// src/App.jsx
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import DashboardLayout from "./layouts/dashboardlayouts";
import Routesconfig from "./manageroutes/routesconfig";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router future={{ v7_startTransition: true }}>
        <DashboardLayout>
          <Routesconfig />
        </DashboardLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
//     <RouterProvider router={router} future={{ v7_startTransition: true }} />
