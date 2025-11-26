import React, { useState } from "react";
import { 
  Box, TextField, InputAdornment, IconButton,
  Menu, MenuItem, Checkbox, FormControlLabel, Select, FormControl, InputLabel, Button 
} from "@mui/material";
import { Search, Settings, Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const SORT_FIELDS = [
  { value: "fecha", label: "Fecha" },
  { value: "total", label: "Total" },
];

const VentaSearchBar = ({ 
  filter, onFilterChange, onAddVenta, showInactive, onToggleInactive,
  visibleColumns, setVisibleColumns,
  sortBy, setSortBy, advancedFilters, setAdvancedFilters,
  handleShowAll, ALL_COLUMNS
}) => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleColumnsClick = (e) => setAnchorEl(e.currentTarget);
  const handleColumnsClose = () => setAnchorEl(null);

  const toggleColumn = (key) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSortChange = (e) => {
    const [key, direction] = e.target.value.split("|");
    setSortBy({ key, direction });
  };

  const handleAdvFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ display:"flex", justifyContent:"space-between", mb:2, gap:2, flexWrap:"wrap" }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {/* 🔍 BUSCADOR */}
      <TextField
        size="small"
        placeholder="Buscar venta..."
        value={filter}
        onChange={(e)=>onFilterChange(e.target.value)}
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
        <MenuItem disableRipple sx={{ fontWeight:"bold", opacity:.8 }}> 
        Columnas visibles 
        </MenuItem>

        <MenuItem onClick={handleShowAll}>
          <FormControlLabel
            control={<Checkbox 
              checked={
                Object.values(visibleColumns).every(v=>v)} />}
            label="Mostrar todas"
          />
        </MenuItem>

        <Box sx={{ borderTop:"1px solid #ddd", mx:1, my:.5 }}/>

        {Object.keys(visibleColumns).map(k=>(
          <MenuItem key={k} onClick={()=>toggleColumn(k)}>
            <FormControlLabel control={<Checkbox checked={visibleColumns[k]}/>} label={ALL_COLUMNS[k]}/>
          </MenuItem>
        ))}
      </Menu>


      {/* 🔽 ORDENAMIENTO */}
      <FormControl size="small" sx={{ minWidth:180 }}>
        <InputLabel>Ordenar</InputLabel>
        <Select value={`${sortBy.key}|${sortBy.direction}`} label="Ordenar" onChange={handleSortChange}>
          {SORT_FIELDS.map(s => (
            <MenuItem key={`${s.value}|asc`} value={`${s.value}|asc`}>{s.label} (Ascendente)</MenuItem>
          ))}
          {SORT_FIELDS.map(s => (
            <MenuItem key={`${s.value}|desc`} value={`${s.value}|desc`}>{s.label} (Descendente)</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* 🔽 FILTRO MÉTODO DE PAGO */}
      <FormControl size="small" sx={{ minWidth:160 }}>
        <InputLabel>Metodo Pago</InputLabel>
        <Select
          value={advancedFilters.metodoPago || ""}
          label="Metodo Pago"
          onChange={(e) => handleAdvFilterChange("metodoPago", e.target.value)}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="EFECTIVO">Efectivo</MenuItem>
          <MenuItem value="TRANSFERENCIA">Transferencia</MenuItem>
        </Select>
      </FormControl>

            
      {/* 📅 FILTRO POR FECHA - INICIO */}
      <DatePicker
        label="Fecha desde"
        value={advancedFilters.fechaInicio ? dayjs(advancedFilters.fechaInicio) : null}
        onChange={(newValue) =>
          handleAdvFilterChange("fechaInicio", newValue ? newValue.format("YYYY-MM-DD") : "")
        }
        slotProps={{ textField: { size:"small", sx:{ minWidth:160 } }}}
      />

      {/* 📅 FILTRO POR FECHA - FIN */}
      <DatePicker
        label="Fecha hasta"
        value={advancedFilters.fechaFin ? dayjs(advancedFilters.fechaFin) : null}
        onChange={(newValue) =>
          handleAdvFilterChange("fechaFin", newValue ? newValue.format("YYYY-MM-DD") : "")
        }
        slotProps={{ textField: { size:"small", sx:{ minWidth:160 } }}}
      />

      </Box>

      <Box>

      {/* ➕ NUEVA VENTA */}
      <Button variant="contained" color="primary" startIcon={<Add/>} onClick={onAddVenta}>
        Nueva Venta
      </Button>
    </Box>
  </Box>
  );
};

export default VentaSearchBar;

