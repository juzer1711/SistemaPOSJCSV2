import React, {useState} from "react";
import { 
  Box, TextField, InputAdornment, Button , MenuItem, ToggleButton,
  ToggleButtonGroup,  FormControl,
  InputLabel,
  Select
} from "@mui/material";
import { Add, Search, Settings } from "@mui/icons-material";


const UserSearchBar = ({ 
  filter, 
  onFilterChange, 
  onAdd, 
  showInactive, 
  onToggleInactive,
  advancedFilters, setAdvancedFilters, 
  handleShowAll
}) => {
  const handleChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  return (
    <Box
      sx={{
        mb: 2,
        p: 2,
        borderRadius: 2,
        backgroundColor: "#fff",
        boxShadow: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      {/* 🔍 SECCIÓN DE FILTROS */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        
        {/* BUSCADOR GLOBAL (Busca por nombre completo, email o documento según tu back) */}
        <TextField
          size="small"
          placeholder="Buscar nombre, email..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
        />

        {/* FILTRO POR ROL */}
        <TextField
          select
          size="small"
          label="Rol"
          value={advancedFilters.rol || ""}
          onChange={(e) => handleChange("rol", e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
          <MenuItem value="CAJERO">Cajero</MenuItem>
        </TextField>

        {/* FILTRO POR TIPO DE DOCUMENTO */}
        <TextField
          select
          size="small"
          label="Tipo Doc."
          value={advancedFilters.tipoDocumento || ""}
          onChange={(e) => handleChange("tipoDocumento", e.target.value)}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="CEDULA_CIUDADANIA">Cédula Ciudadanía</MenuItem>
          <MenuItem value="CEDULA_EXTRANJERIA">Cédula Extranjería</MenuItem>
          <MenuItem value="NIT">NIT</MenuItem>
          <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
        </TextField>

        {/* TOGGLE ACTIVO / INACTIVO (Estado) */}
        <ToggleButtonGroup
          size="small"
          color="primary"
          value={showInactive ? "inactive" : "active"}
          exclusive
          onChange={(e, val) => {
            if (val !== null) onToggleInactive();
          }}
        >
          <ToggleButton value="active">Activos</ToggleButton>
          <ToggleButton value="inactive">Inactivos</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ➕ ACCIONES */}
      <Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
          sx={{ backgroundColor: "#1976d2" }}
        >
          Nuevo Usuario
        </Button>
      </Box>
    </Box>
  );
};

export default UserSearchBar;