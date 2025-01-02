import React, { useState } from 'react';
import DemandList from './DemandList';
import { Box, Button, Typography } from '@mui/material';
import Upload from './Upload';
import ProcessingList from './ProcessingList';
import UnprocessingList from './UnprocessedsTasksList';

const SirespIntegration: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState(1);

  const renderComponent = () => {
    switch (selectedItem) {
      case 1:
        return <DemandList />;
      case 2:
        return <Upload />;
      case 3:
        return <ProcessingList />
      case 4:
        return <UnprocessingList />
      default:
        return <DemandList />;
    }
  };

  return (
    <Box  >
      <Box display="flex" justifyContent="center" my={2} ml={1} >
        <Button
          variant={selectedItem === 1 ? 'contained' : 'outlined'}
          color="secondary"
          onClick={() => setSelectedItem(1)}
        >
          Demanda Atual
        </Button>
        <Button
          variant={selectedItem === 2 ? 'contained' : 'outlined'}
          color="secondary"
          onClick={() => setSelectedItem(2)}
          style={{ marginLeft: '8px' }}
        >
          Upload Planilha 
        </Button>
        <Button
          variant={selectedItem === 3 ? 'contained' : 'outlined'}
          color="secondary"
          onClick={() => setSelectedItem(3)}
          style={{ marginLeft: '8px' }}
        >
          Processamentos 
        </Button>
        <Button
          variant={selectedItem === 4 ? 'contained' : 'outlined'}
          color="secondary"
          onClick={() => setSelectedItem(4)}
          style={{ marginLeft: '8px' }}
        >
          Tarefas Pendentes 
        </Button>
      </Box>
      <Box >
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default SirespIntegration;
