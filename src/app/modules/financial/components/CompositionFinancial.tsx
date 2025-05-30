import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import UploadCompositionFinancial from './UploadCompositionFinancial';
import { AssignmentTurnedIn, FileUpload } from '@mui/icons-material';
import AutomationTaskTable from './AutomationTaskTable';

const CompositionFinancial: React.FC<{serviceId: number, templateId: number}> = ({serviceId, templateId}) => {
  const [selectedItem, setSelectedItem] = useState(0);

  const renderComponent = () => {
    switch (selectedItem) {
      case 0:
        return <UploadCompositionFinancial  serviceId={serviceId} templateId={templateId}/>;
      case 1:
        return <AutomationTaskTable />;
      default:
        return "Item 1";
    }
  };

  return (
    <Box mt={1}>
      <Box height={30} >
        <Button
          variant={selectedItem === 0 ? 'contained' : 'outlined'}
          color={selectedItem === 0 ? 'primary' : 'primary'}
          onClick={() => setSelectedItem(0)}
          sx={{ marginRight: 1 }}
          startIcon={<FileUpload />}
        >
          Upload Comp. Financeira
        </Button>
        <Button
          variant={selectedItem === 1 ? 'contained' : 'outlined'}
          color={selectedItem === 1 ? 'primary' : 'primary'}
          onClick={() => setSelectedItem(1)}
          sx={{ marginRight: 1 }}
          startIcon={<AssignmentTurnedIn />}
        >
          Tarefas
        </Button>
      </Box>
      <Box mt={2} >
        {renderComponent()}
      </Box>
    </Box>
  );
};

export default CompositionFinancial;
