import React, { useState } from "react";
import { TextField, Box, Button, Grid } from "@mui/material";

const ClientSearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);  // Llamamos a la función onSearch para filtrar
  };

  const handleClear = () => {
    setSearchTerm("");  // Limpiar la búsqueda
    onSearch("");  // Volver a cargar todos los clientes
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8} md={10}>
          <TextField
            label="Buscar Cliente"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={4} md={2} display="flex" justifyContent="flex-end">
          <Button variant="contained" onClick={handleSearch}>Buscar</Button>
          <Button variant="outlined" onClick={handleClear} sx={{ ml: 1 }}>
            Limpiar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientSearchBar;
