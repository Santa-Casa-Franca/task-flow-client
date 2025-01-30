import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { fetchData } from '@/connection';
import { GridColDef } from '@mui/x-data-grid';
import ReusableDataGrid from '@/app/componets/ReusableDataGrid';
import { formatDateTimeToBR } from '@/app/utils/formatDate';

interface Processing {
  id: number;
  amountCreated: number;
  amountUpdated: number;
  amountDeleted: number;
  wasErro: boolean;
  dsErro?: string;
  createdAt: string;
  updatedAt: string;
}

const ProcessingList: React.FC = () => {
  const [data, setData] = useState<Processing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await fetchData('/processings');
        setIsLoading(false)
        setData(response);
      } catch (error) {
        setIsLoading(false)
        console.error('Failed to fetch data:', error);
      }
    }

    getData();
  }, []);


  const columns: GridColDef[] = [
    { field: 'createdAt', headerName: 'Data Processamento', width: 180, renderCell: (params) => formatDateTimeToBR(params.row.createdAt) },
    { field: 'amountCreated', headerName: 'Qtd Add', width: 100 },
    { field: 'amountUpdated', headerName: 'Qtd Atualizada', width: 150 },
    { field: 'amountDeleted', headerName: 'Qtd Removida', width: 150 },
    { field: 'wasErro', headerName: 'Falha ', width: 100, renderCell: (params) => params.row.wasErro === true ? "Sim" : "Não"  },
    { field: 'dsErro', headerName: 'Descrição Falha', width: 250 },
    
  ];

  return (
    <Box >
      {isLoading === true ? <CircularProgress /> :

        <Box height={"80vh"}>
          <ReusableDataGrid columns={columns} rows={data} />
        </Box>
      }
     
    </Box>
  );
};

export default ProcessingList;
