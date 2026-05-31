import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import theme from "./theme";
import { SnackbarProvider } from "./context/SnackBarProvider";
import { EmpresaProvider } from "./context/EmpresaContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EmpresaProvider>
      <SnackbarProvider>
      <App />
      </SnackbarProvider>
      </EmpresaProvider>
    </ThemeProvider>
  </React.StrictMode>
);