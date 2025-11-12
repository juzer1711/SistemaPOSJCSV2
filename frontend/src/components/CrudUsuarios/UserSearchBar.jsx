import React from "react";
import { Box, TextField, InputAdornment, Button } from "@mui/material";
import { Add, Search } from "@mui/icons-material";

const UserSearchBar = ({ filter, onFilterChange, onAdd }) => (
  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
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
    <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
      Nuevo usuario
    </Button>
  </Box>
);

export default UserSearchBar;
