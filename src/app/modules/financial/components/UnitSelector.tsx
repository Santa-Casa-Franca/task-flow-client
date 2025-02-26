import React from 'react';
import { Select, MenuItem, Box } from '@mui/material';
import { useUnit } from './UnitProvider';
import { Elderly, Favorite, Grass, Home, Pool, Water, WbSunny } from '@mui/icons-material';

const UnitSelector: React.FC = () => {
  const { selectedUnit, setSelectedUnit } = useUnit();
  const units = [
    { label: "AME CAMPINAS", icon: <WbSunny />, value: "campinas" },
    { label: "AME CASA BRANCA", icon: <Home />, value: "casaBranca" },
    { label: "AME FRANCA", icon: <Favorite color='error' />, value: "franca" },
    { label: "AME RIBEIRAO PRETO", icon: <Water />, value: "ribeiraoPreto" },
    { label: "AME SAO CARLOS", icon: <Elderly />, value: "saoCarlos" },
    { label: "AME TAQUARITINGA", icon: <Grass />, value: "taquaritinga" },
    { label: "AME VALE DO JURUMIRIM", icon: <Pool />, value: "valeDoJurumirim" },
  ];

  return (
    <Box display="flex" alignItems="center">
      <Select value={selectedUnit} onChange={(e) => setSelectedUnit(e.target.value)} size='small'>
        {units.map((unit) => (
          <MenuItem key={unit.label} value={unit.value}>
            <Box display="flex" alignItems="center">
              {unit.icon} {unit.label}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

export default UnitSelector;
