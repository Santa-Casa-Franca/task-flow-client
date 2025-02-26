"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';
import { RegulationPage } from './modules/regulation';
import Sidebar from './componets/Sidebar';
import { FinancialPage } from './modules/financial';

export default function Home() {
  const [selectedOption, setSelectedOption] = React.useState<number>(0);

  const renderContent = () => {
    switch (selectedOption) {
      case 0:
        return <RegulationPage />;
      case 1:
        return <FinancialPage />;
      default:
        return <Typography variant="h6">Selecione uma opção</Typography>;
    }
  };

  return (

    <Box display="flex">
      <Box >
        <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </Box>
      <Box
        component="main"
        sx={{
          width: "100%", 
          height: "100vh",
          overflow: "auto", 
        }}
      >
        {renderContent()}
      </Box>
    </Box>

  );
}
