import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#ff5722",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontSize: "2rem",
      fontWeight: 700,
    },
    h6: {
      fontSize: "1.25rem",
      fontWeight: 500,
    },
  },
});

export default theme;
