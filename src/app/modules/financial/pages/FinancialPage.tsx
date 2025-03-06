import React, { useState } from 'react';
import { Box, Divider, Select, MenuItem } from '@mui/material';
import { UnitProvider } from '../components/UnitProvider';
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
      <Box display="flex" justifyContent="start"  borderBottom={"1px solid black"} bgcolor={"white"} height={40}>
        <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} width={"100%"} >
          <Box width={"88%"}>
            <Select
              value={selectedItem}
              onChange={(e) => setSelectedItem(Number(e.target.value))}
              sx={{width: 200, ml: 1}}
              size='small'
              variant='standard'
            >
              <MenuItem value={1}>Composição Financeira</MenuItem>
              <MenuItem value={2}>Demonstrativo Contábil</MenuItem>
            </Select>
          </Box>
          <Box width={"12%"}>
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
