import React from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { Search, Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const VentaSearchBar = ({
  filter,
  onFilterChange,
  onAddVenta,
  showInactive,
  onToggleInactive,
  advancedFilters,
  setAdvancedFilters
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
      {/* 🔍 FILTROS */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>

        {/* BUSCADOR */}
        <TextField
          size="small"
          placeholder="Buscar cliente, documento..."
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

        {/* MÉTODO DE PAGO */}
        <TextField
          select
          size="small"
          label="Método"
          value={advancedFilters.metodoPago || ""}
          onChange={(e) => handleChange("metodoPago", e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="EFECTIVO">Efectivo</MenuItem>
          <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
        </TextField>

        {/* FECHA INICIO */}
        <DatePicker
          label="Desde"
          value={advancedFilters.fechaInicio ? dayjs(advancedFilters.fechaInicio) : null}
          onChange={(newValue) =>
            handleChange(
              "fechaInicio",
              newValue ? newValue.format("YYYY-MM-DD") : ""
            )
          }
          slotProps={{
            textField: { size: "small", sx: { minWidth: 140 } }
          }}
        />

        {/* FECHA FIN */}
        <DatePicker
          label="Hasta"
          value={advancedFilters.fechaFin ? dayjs(advancedFilters.fechaFin) : null}
          onChange={(newValue) =>
            handleChange(
              "fechaFin",
              newValue ? newValue.format("YYYY-MM-DD") : ""
            )
          }
          slotProps={{
            textField: { size: "small", sx: { minWidth: 140 } }
          }}
        />

        {/* TOGGLE ACTIVO / INACTIVO */}
        <ToggleButtonGroup
          size="small"
          value={showInactive ? "inactive" : "active"}
          exclusive
          onChange={(e, val) => {
            if (val !== null) onToggleInactive();
          }}
        >
          <ToggleButton value="active">Activas</ToggleButton>
          <ToggleButton value="inactive">Inactivas</ToggleButton>
        </ToggleButtonGroup>

      </Box>

      {/* ACCIONES */}
      <Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAddVenta}
        >
          Nueva Venta
        </Button>
      </Box>
    </Box>
  );
};

export default VentaSearchBar;

