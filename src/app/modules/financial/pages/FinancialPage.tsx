import React, { useState } from 'react';
import { Box, Divider, Select, MenuItem } from '@mui/material';
import { UnitProvider } from '../components/UnitProvider';
import UploadCompositionFinancial from '../components/UploadCompositionFinancial';
import UnitSelector from '../components/UnitSelector';
import CompositionFinancial from '../components/CompositionFinancial';

const FinancialPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(1);

  const renderComponent = () => {
    switch (selectedItem) {
      case 1:
        return <CompositionFinancial />;
      default:
        return "comp 1";
    }
  };

  return (
    <UnitProvider>
      <Box display="flex" justifyContent="start" my={1} pb={1} borderBottom={"1px solid black"} bgcolor={"white"}>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
          <Box width={"85%"}>
            <Select
              value={selectedItem}
              onChange={(e) => setSelectedItem(Number(e.target.value))}
              sx={{width: 200, ml: 1}}
              size='small'
            >
              <MenuItem value={1}>Composição Financeira</MenuItem>
              <MenuItem value={2}>Demonstrativo Contábil</MenuItem>
            </Select>
          </Box>
          <Divider variant='fullWidth' orientation='vertical' sx={{ mr: 1 }} />
          <Box width={"15%"}>
            <UnitSelector />
          </Box>
        </Box>
      </Box>
      <Box mx={1} overflow={"auto"}>
        {renderComponent()}
      </Box>
    </UnitProvider>
  );
};

export default FinancialPage;
