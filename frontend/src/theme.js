import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976D2",   // TU AZUL
    },
    secondary: {
      main: "#0D47A1",
    },
    background: {
      default: "#F4F6F8",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2E2E2E",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
  },
});

export default theme;