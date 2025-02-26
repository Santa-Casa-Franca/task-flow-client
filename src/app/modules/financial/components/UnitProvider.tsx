import React, { createContext, useContext, useState } from 'react';
import { Home, Favorite, Water, Elderly, Grass, Pool, WbSunny } from '@mui/icons-material';

interface UnitContextType {
  selectedUnit: string;
  setSelectedUnit: (unit: string) => void;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const units = [
    { label: "AME CAMPINAS", icon: <WbSunny />, value: "campinas" },
    { label: "AME CASA BRANCA", icon: <Home />, value: "casa-branca" },
    { label: "AME FRANCA", icon: <Favorite color='error' />, value: "franca" },
    { label: "AME RIBEIRAO PRETO", icon: <Water />, value: "ribeirao-preto" },
    { label: "AME SAO CARLOS", icon: <Elderly />, value: "sao-carlos" },
    { label: "AME TAQUARITINGA", icon: <Grass />, value: "taquaritinga" },
    { label: "AME VALE DO JURUMIRIM", icon: <Pool />, value: "vale-do-jurumirim" },
  ];

  const [selectedUnit, setSelectedUnit] = useState(units[0].value);

  return (
    <UnitContext.Provider value={{ selectedUnit, setSelectedUnit }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnit = () => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error("useUnit must be used within a UnitProvider");
  }
  return context;
};
