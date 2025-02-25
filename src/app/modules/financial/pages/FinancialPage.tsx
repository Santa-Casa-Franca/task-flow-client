import React, { useState } from 'react';
import { Box, Button} from '@mui/material';
import HorizontalLinearStepper from '../components/Stepper';

const FinancialPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(1);

  const renderComponent = () => {
    switch (selectedItem) {
      case 1:
        return <HorizontalLinearStepper />
      default:
        return "comp 1";
    }
  };

  return (
    <Box >
      <Box display="flex" justifyContent="start" my={2} mx={1} pb={1} borderBottom={"1px solid black"}>
        <Button
          variant={selectedItem === 1 ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setSelectedItem(1)}
        >
          Integração G. Em Saúde
        </Button>
      </Box>
      <Box mx={1}>
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default FinancialPage;
