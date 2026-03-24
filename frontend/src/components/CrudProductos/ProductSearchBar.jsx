import React, {useState, useEffect} from "react";
import { 
  Box, TextField, InputAdornment, Button, IconButton,
  Menu, MenuItem, Checkbox, FormControlLabel, Select, FormControl, 
  InputLabel, Autocomplete
} from "@mui/material";
import { Add, Search, Settings } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const SORT_FIELDS = [
  { value: "nombre", label: "Nombre Producto" },
  { value: "categoria", label: "Categoria" },
  { value: "descripcion", label: "Descripcion"},
];

const ProductSearchBar = ({ 
  filter, onFilterChange, onAdd, showInactive, onToggleInactive,
  visibleColumns, setVisibleColumns,
  sortBy, setSortBy,
  advancedFilters, setAdvancedFilters, handleShowAll, ALL_COLUMNS, 
  categorias, onEditCategoria, onAddCategoria
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
      placeholder="Buscar producto..."
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

    {/* Filtros rápidos */}
    <Autocomplete
      size="small"
      options={categorias}               // Lista de categorías
      getOptionLabel={(option) => option.nombre}   // Qué mostrar
      isOptionEqualToValue={(option, value) => option.idCategoria === value.idCategoria}
      value={categorias.find(c => Number(c.idCategoria) === Number(advancedFilters.categoria)) || null}
      onChange={(e, newValue) =>
        handleAdvFilterChange("categoria", newValue ? newValue.idCategoria : "")
      }
      renderInput={(params) => (
        <TextField {...params} label="Categoría" />
      )}
      sx={{ minWidth: 200 }}
      renderOption={(props, option) => (
      <Box component="li" {...props} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {option.nombre}
        <IconButton
          size="small"
          onClick={(event) => {
            event.stopPropagation(); // Evita que se seleccione la opción al hacer clic en el icono
            onEditCategoria(option); // Llama a tu función de edición con la categoría
          }}
          aria-label={`editar ${option.nombre}`}
        >
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      )}
    />

  </Box>
      {/* Botones */}
      <Box>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<Add />} 
          sx={{ mr: 1 }}
          onClick={onAddCategoria}
        >
          Agregar Categoria
        </Button>
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

export default ProductSearchBar;
