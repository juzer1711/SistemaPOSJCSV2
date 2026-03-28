import React, { useState } from "react";
import {
  Box, TextField, InputAdornment, Button, IconButton,
  Menu, MenuItem, Checkbox, FormControlLabel,
  Select, FormControl, InputLabel
} from "@mui/material";
import { Add, Search, Settings } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const SORT_FIELDS = [
  { value: "primerNombre", label: "Primer Nombre" },
  { value: "primerApellido", label: "Primer Apellido" },
  { value: "razonSocial", label: "Razón Social" },
  { value: "documento", label: "Documento" },
];

const ClientSearchBar = ({
  filter, onFilterChange, onAdd,
  showInactive, onToggleInactive,
  visibleColumns, setVisibleColumns,
  sortBy, setSortBy,
  advancedFilters, setAdvancedFilters,
  handleShowAll, ALL_COLUMNS
}) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleColumnsClick = (e) => setAnchorEl(e.currentTarget);
  const handleColumnsClose = () => setAnchorEl(null);

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSortChange = (e) => {
    const [key, dir] = e.target.value.split("|");
    setSortBy({ key, direction: dir });
  };

  const handleAdvFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
      
      {/* BUSCADOR + CONFIG */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        
        <TextField
          size="small"
          placeholder="Buscar cliente..."
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

        {/* COLUMNAS */}
        <IconButton size="small" onClick={handleColumnsClick}>
          <Settings />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleColumnsClose}>
          <MenuItem onClick={handleShowAll}>
            <FormControlLabel
              control={<Checkbox checked={Object.values(visibleColumns).every(v => v)} />}
              label="Mostrar todas"
            />
          </MenuItem>

          {Object.keys(visibleColumns).map((k) => (
            <MenuItem key={k} onClick={() => toggleColumn(k)}>
              <FormControlLabel
                control={<Checkbox checked={visibleColumns[k]} />}
                label={ALL_COLUMNS[k]}
              />
            </MenuItem>
          ))}
        </Menu>

        {/* ACTIVO / INACTIVO */}
        <ToggleButtonGroup
          size="small"
          value={showInactive ? "inactive" : "active"}
          exclusive
          onChange={(e, val) => {
            if (val !== null) onToggleInactive();
          }}
        >
          <ToggleButton value="active">Activos</ToggleButton>
          <ToggleButton value="inactive">Inactivos</ToggleButton>
        </ToggleButtonGroup>

        {/* ORDEN */}
        <FormControl size="small">
          <InputLabel>Ordenar</InputLabel>
          <Select
            value={`${sortBy.key}|${sortBy.direction}`}
            label="Ordenar"
            onChange={handleSortChange}
          >
            {SORT_FIELDS.map(s => (
              <MenuItem key={`${s.value}|asc`} value={`${s.value}|asc`}>
                {s.label} (A→Z)
              </MenuItem>
            ))}
            {SORT_FIELDS.map(s => (
              <MenuItem key={`${s.value}|desc`} value={`${s.value}|desc`}>
                {s.label} (Z→A)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* FILTROS */}
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Tipo Cliente</InputLabel>
          <Select
            value={advancedFilters.tipoCliente || ""}
            label="Tipo Cliente"
            onChange={(e) => handleAdvFilterChange("tipoCliente", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="PERSONA_NATURAL">Persona Natural</MenuItem>
            <MenuItem value="EMPRESA">Empresa</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Tipo Documento</InputLabel>
          <Select
            value={advancedFilters.tipoDocumento || ""}
            label="Tipo Documento"
            onChange={(e) => handleAdvFilterChange("tipoDocumento", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="CEDULA_CIUDADANIA">Cédula</MenuItem>
            <MenuItem value="NIT">NIT</MenuItem>
            <MenuItem value="PASAPORTE">Pasaporte</MenuItem>
          </Select>
        </FormControl>

      </Box>

      {/* BOTÓN */}
      <Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
        >
          Agregar
        </Button>
      </Box>
    </Box>
  );
};

export default ClientSearchBar;

