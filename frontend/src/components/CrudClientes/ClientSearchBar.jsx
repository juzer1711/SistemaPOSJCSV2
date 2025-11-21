import React, { useState } from "react";
import {
  Box, TextField, InputAdornment, Button, IconButton,
  Menu, MenuItem, Checkbox, FormControlLabel, Select, FormControl, InputLabel
} from "@mui/material";
import { Add, Search, Settings } from "@mui/icons-material";


const SORT_FIELDS = [
  { value: "primerNombre", label: "Primer Nombre" },
  { value: "primerApellido", label: "Primer Apellido" },
  { value: "razonSocial", label: "Razón Social" },
  { value: "documento", label: "Documento" },
];

const ClientSearchBar = ({
  filter, onFilterChange, onAdd, showInactive, onToggleInactive,
  visibleColumns, setVisibleColumns,
  sortBy, setSortBy,
  advancedFilters, setAdvancedFilters, handleShowAll, ALL_COLUMNS
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
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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

      <IconButton size="small" onClick={handleColumnsClick} title="Configurar columnas">
        <Settings />
      </IconButton>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleColumnsClose}
        PaperProps={{
          sx: { width: 240, paddingY: 1 }
        }}
      >

        {/* Título */}
        <MenuItem disableRipple sx={{ opacity: 0.7, fontWeight: "bold", cursor: "default" }}>
          Columnas visibles
        </MenuItem>

        {/* Botón: Mostrar todas */}
        <MenuItem onClick={handleShowAll}>
          <FormControlLabel
            control={<Checkbox 
              checked={
                Object.values(visibleColumns).every(v => v === true)
              } 
            />}
            label="Mostrar todas"
          />
        </MenuItem>

        {/* Divider */}
        <Box sx={{ borderTop: "1px solid #ddd", marginY: 1 }} />

        {/* Lista de columnas */}
        {Object.keys(visibleColumns).map((k) => (
          <MenuItem key={k} onClick={() => toggleColumn(k)}>
            <FormControlLabel
              control={<Checkbox checked={!!visibleColumns[k]} />}
              label={ALL_COLUMNS[k]}   // ← ¡Ahora aparece bonito!
            />
          </MenuItem>
        ))}
      </Menu>


        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Ordenar</InputLabel>
          <Select
            value={`${sortBy.key}|${sortBy.direction}`}
            label="Ordenar"
            onChange={handleSortChange}
          >
            {SORT_FIELDS.map(s => (
              <MenuItem key={`${s.value}|asc`} value={`${s.value}|asc`}>{s.label} (A→Z)</MenuItem>
            ))}
            {SORT_FIELDS.map(s => (
              <MenuItem key={`${s.value}|desc`} value={`${s.value}|desc`}>{s.label} (Z→A)</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtros rápidos */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Tipo Cliente</InputLabel>
          <Select
            value={advancedFilters.tipoCliente || ""}
            label="Tipo Cliente"
            onChange={(e) => handleAdvFilterChange("tipoCliente", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Persona Natural">Persona Natural</MenuItem>
            <MenuItem value="Empresa">Empresa</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }} >
          <InputLabel>Estado</InputLabel>
          <Select
            value={advancedFilters.estado || ""}
            label="Estado"
            onChange={(e) => handleAdvFilterChange("estado", e.target.value)}
            onClick={onToggleInactive}
          >
            <MenuItem value="activo">Activos</MenuItem> {showInactive = "Ver activos"}
            <MenuItem value="inactivo">Inactivos</MenuItem> {showInactive = "Ver activos"}
            
          </Select>
        </FormControl>

      </Box>

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
      </Box>
    </Box>
  );
};

export default ClientSearchBar;


