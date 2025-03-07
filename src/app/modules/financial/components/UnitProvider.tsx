import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchData } from "@/connection";

export type Unit = {
  id: number;
  name: string;
  value: string; 
};

interface UnitContextType {
  selectedUnitId: number | null; 
  selectedUnitValue: string | null; 
  setSelectedUnit: (id: number | null) => void;
  units: Unit[];
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

export const UnitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [selectedUnitValue, setSelectedUnitValue] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetchData("/units")
      .then(res => {
        setUnits(res);
        if (res.length > 0) {
          setSelectedUnitId(res[0].id);
          setSelectedUnitValue(res[0].value);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const setSelectedUnit = (id: number | null) => {
    const unit = units.find(u => u.id === id);
    setSelectedUnitId(id);
    setSelectedUnitValue(unit ? unit.value : null);
  };

  return (
    <UnitContext.Provider value={{ selectedUnitId, selectedUnitValue, setSelectedUnit, units }}>
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
