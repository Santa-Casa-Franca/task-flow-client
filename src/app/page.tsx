"use client";
import React from 'react';
import { Box, Typography } from '@mui/material';
import { RegulationPage } from './modules/regulation';
import Sidebar from './componets/Sidebar';

export default function Home() {
  const [selectedOption, setSelectedOption] = React.useState<number>(0);

  const renderContent = () => {
    switch (selectedOption) {
      case 0:
        return <RegulationPage />;
      case 1:
        return <Typography variant="h6">Conteúdo da Opção 2</Typography>;
      default:
        return <Typography variant="h6">Selecione uma opção</Typography>;
    }
  };

  return (
    <Box display="flex">
      <Box width={240}>
        <Sidebar selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </Box>
      <Box
        component="main"
        sx={{
          width: "calc(100vw - 240px)", 
          height: "100vh",
          overflow: "auto", 
        }}
      >
        {renderContent()}
      </Box>
    </Box>

  );
}
