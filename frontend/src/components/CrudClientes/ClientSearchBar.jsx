import React from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import { Add, Search } from "@mui/icons-material";

const ClientSearchBar = ({ filter, onFilterChange, onAdd, showInactive, onToggleInactive }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
      {/* Barra de búsqueda */}
      <TextField
        size="small"
        placeholder="Buscar usuario..."
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* Botones */}
      <Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          sx={{ mr: 1 }}
          onClick={onAdd}
        >
          Agregar
        </Button>

        <Button 
          variant="outlined" 
          onClick={onToggleInactive}
        >
          {showInactive ? "Ver activos" : "Ver inactivos"}
        </Button>
      </Box>

    </Box>
  );
};

export default ClientSearchBar;

