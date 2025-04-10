import React, { useState } from 'react';
import { Box } from '@mui/material';
import { UnitProvider } from '../components/UnitProvider';
import UnitSelector from '../components/UnitSelector';
import CompositionFinancial from '../components/CompositionFinancial';
import ServiceSelector from '../components/ServiceSelector';
import TemplateSelector from '../components/TemplateSelector';
import DemonstrationFinancial from '../components/DemonstrationFinancial';
import AssistanceServices from '../components/AssistanceServices';
import CashFlow from '../components/CashFlow';

const FinancialPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleServiceChange = (serviceId: number) => {
    setSelectedService(serviceId);
    setSelectedTemplate(null); 
  };

  return (
    <UnitProvider>
      <Box display="flex" justifyContent="start" borderBottom="1px solid black" bgcolor="white" height={60}>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
          <Box width="88%">
            <Box display="flex">
              <ServiceSelector selectedService={selectedService} onChange={handleServiceChange} />
              <TemplateSelector selectedService={selectedService} selectedTemplate={selectedTemplate} onChange={setSelectedTemplate} />
            </Box>
          </Box>
          <Box width="12%">
            <UnitSelector />
          </Box>
        </Box>
      </Box>
      <Box mx={1} overflow="auto">
        
        {selectedService === 1 && selectedTemplate && <CompositionFinancial serviceId={selectedService} templateId={selectedTemplate} />} {/* felipe */}
        {selectedService === 2 && selectedTemplate && <DemonstrationFinancial serviceId={selectedService} templateId={selectedTemplate} />} {/* Cristiane */}
        {selectedService === 3 && selectedTemplate && <AssistanceServices serviceId={selectedService} templateId={selectedTemplate} />} {/* felipe */}
        {selectedService === 4 && selectedTemplate && <CashFlow serviceId={selectedService} templateId={selectedTemplate} />} {/* Lisiane */}
      </Box>
    </UnitProvider>
  );
};

export default FinancialPage;
