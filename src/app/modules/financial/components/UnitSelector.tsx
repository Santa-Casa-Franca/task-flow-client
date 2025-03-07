import React, { useEffect, useState } from "react";
import { Select, MenuItem, Box, CircularProgress } from "@mui/material";
import { useUnit } from "./UnitProvider";

const UnitSelector: React.FC = () => {
  const { selectedUnitId, setSelectedUnit, units } = useUnit();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(units.length === 0);
  }, [units]);

  return (
    <Box display="flex" alignItems="center">
      {!isLoading ? (
        <Select
          value={selectedUnitId ?? ""}
          onChange={(e) => setSelectedUnit(Number(e.target.value))}
          size="small"
          variant="standard"
          sx={{color: "blue"}}
        >
          {units.map((unit) => (
            <MenuItem key={unit.id} value={unit.id} color="primary">
              {unit.name}
            </MenuItem>
          ))}
        </Select>
      ) : (
        <CircularProgress />
      )}
    </Box>
  );
};

export default UnitSelector;
