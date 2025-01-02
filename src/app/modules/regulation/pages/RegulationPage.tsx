import React, { useState } from 'react';
import { Box, Button} from '@mui/material';
import SirespIntegration from '../components/SirespIntegration';

const RegulationPage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(1);

  const renderComponent = () => {
    switch (selectedItem) {
      case 1:
        return <SirespIntegration />;
      default:
        return <SirespIntegration />;
    }
  };

  return (
    <Box >
      <Box display="flex" justifyContent="start" my={2} ml={1} pb={1} borderBottom={"1px solid black"}>
        <Button
          variant={selectedItem === 1 ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setSelectedItem(1)}
        >
          Integração SIRESP
        </Button>
      </Box>
      <Box>
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default RegulationPage;
