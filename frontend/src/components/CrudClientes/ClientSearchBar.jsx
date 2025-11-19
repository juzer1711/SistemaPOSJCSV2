import React, { useState } from "react";
import { TextField, Box, Button, InputAdornment  } from "@mui/material";
import { Add, Search } from "@mui/icons-material";

const ClientSearchBar = ({
  onSearch,
  onAdd,
  showInactive,
  onToggleInactive,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
        mb: 3,
      }}
    >
      {/* Campo de búsqueda */}
      <TextField
        size="small"
        placeholder="Buscar cliente..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />


      {/* Botón Buscar */}
      <Button variant="contained" onClick={handleSearch}>
        Buscar
      </Button>

      {/* Botón Limpiar */}
      <Button variant="outlined" onClick={handleClear}>
        Limpiar
      </Button>

      {/* Botón Agregar */}
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onAdd}
      >
        Agregar
      </Button>

      {/* Botón Mostrar activos/inactivos */}
      <Button variant="outlined" onClick={onToggleInactive}>
        {showInactive ? "Mostrar Activos" : "Mostrar Inactivos"}
      </Button>
    </Box>
  );
};

export default ClientSearchBar;
