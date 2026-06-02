import React from "react";

import {
  Box,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";

import {
  Add,
  Search,
} from "@mui/icons-material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import TableViewIcon    from "@mui/icons-material/TableView";
import { CircularProgress } from "@mui/material";

const UserSearchBar = ({
  filter,
  onFilterChange,
  onAdd,
  showInactive,
  onToggleInactive,
  advancedFilters,
  setAdvancedFilters,
    onExportExcel,
  onExportCSV,
    loadingExcel,
    loadingCSV
}) => {

  const handleChange = (field, value) =>
    setAdvancedFilters((prev) => ({
      ...prev,
      [field]: value,
    }));

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >

      {/* LEFT SIDE */}
      <Stack
        direction="row"
        spacing={2}
        useFlexGap
        flexWrap="wrap"
        alignItems="center"
      >

        <TextField
          size="small"
          placeholder="Buscar usuario o email..."
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          sx={{
            width: 280,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          size="small"
          label="Rol"
          value={advancedFilters.rol || ""}
          onChange={(e) => handleChange("rol", e.target.value)}
          sx={{
            minWidth: 160,
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
          <MenuItem value="CAJERO">Cajero</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
          label="Documento"
          value={advancedFilters.tipoDocumento || ""}
          onChange={(e) => handleChange("tipoDocumento", e.target.value)}
          sx={{
            minWidth: 180,
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="CEDULA_CIUDADANIA">
            Cédula Ciudadanía
          </MenuItem>

          <MenuItem value="CEDULA_EXTRANJERIA">
            Cédula Extranjería
          </MenuItem>

          <MenuItem value="NIT">
            NIT
          </MenuItem>

          <MenuItem value="PASAPORTE">
            Pasaporte
          </MenuItem>
        </TextField>

        <Tooltip title={showInactive ? "Mostrar activos" : "Mostrar inactivos"}>
          <Chip
            label={showInactive ? "Inactivos" : "Activos"}
            color={showInactive ? "default" : "primary"}
            onClick={onToggleInactive}
            clickable
            sx={{
              height: 38,
              px: 1,
              fontWeight: 600,
            }}
          />
        </Tooltip>

      </Stack>

            <Button
              variant="outlined"
              size="small"
              startIcon={loadingExcel
                ? <CircularProgress size={14} color="inherit" />
                : <FileDownloadIcon />}
              onClick={onExportExcel}
              disabled={loadingExcel}
            >
              Excel
            </Button>
      
            <Button
              variant="outlined"
              size="small"
              startIcon={loadingCSV
                ? <CircularProgress size={14} color="inherit" />
                : <TableViewIcon />}
              onClick={onExportCSV}
              disabled={loadingCSV}
            >
              CSV
            </Button>

      {/* RIGHT SIDE */}
      <Tooltip title="Registrar nuevo usuario" arrow>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
        >
          Nuevo Usuario
        </Button>
      </Tooltip>

    </Box>
  );
};

export default UserSearchBar;