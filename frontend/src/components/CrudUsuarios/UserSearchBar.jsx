import React from "react";
import {
  Box, TextField, InputAdornment, Button,
  MenuItem, ToggleButton, ToggleButtonGroup, Tooltip,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";

const UserSearchBar = ({
  filter, onFilterChange, onAdd,
  showInactive, onToggleInactive,
  advancedFilters, setAdvancedFilters,
}) => {
  const handleChange = (field, value) =>
    setAdvancedFilters((prev) => ({ ...prev, [field]: value }));

  return (
    <Box
      sx={{
        mb: 2, p: 2, borderRadius: 2,
        backgroundColor: "background.paper",
        boxShadow: 1,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>

        <TextField
          size="small"
          placeholder="Buscar nombre, email..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{ minWidth: 240 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select size="small" label="Rol"
          value={advancedFilters.rol || ""}
          onChange={(e) => handleChange("rol", e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
          <MenuItem value="CAJERO">Cajero</MenuItem>
        </TextField>

        <TextField
          select size="small" label="Tipo Doc."
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

        <ToggleButtonGroup
          size="small" color="primary" exclusive
          value={showInactive ? "inactive" : "active"}
          onChange={(_, val) => { if (val !== null) onToggleInactive(); }}
        >
          <ToggleButton value="active">Activos</ToggleButton>
          <ToggleButton value="inactive">Inactivos</ToggleButton>
        </ToggleButtonGroup>

      </Box>

      {/* ✅ sin color hardcodeado */}
      <Tooltip title="Registrar nuevo usuario" arrow>
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
          Nuevo Usuario
        </Button>
      </Tooltip>
    </Box>
  );
};

export default UserSearchBar;