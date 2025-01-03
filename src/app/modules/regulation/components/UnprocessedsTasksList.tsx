import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { fetchData } from '@/connection';
import { GridColDef } from '@mui/x-data-grid';
import ReusableDataGrid from '@/app/componets/ReusableDataGrid';
import { formatDateTimeToBR } from '@/app/utils/formatDate';

interface Task {
  id: number,
  demandId: number,
  action: string,
  status: string,
  errorMessage?: string,
  processed: boolean,
  createdAt: string,
  updatedAt: string;
  demand: Demand
}

interface Demand {
  id: number;
  code: string;
  name: string;
  phone: string;
  city: string;
  exam: string;
  examType: string;
  patientAge: string;
  entryDate: string;
  status: string;
  statusNote: string;
  createdAt: string;
  updatedAt: string;
}


const UnprocessingList: React.FC = () => {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await fetchData('/tasks/unprocessed');
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
    {
      field: 'name',
      headerName: 'Nome',
      width: 250,
      renderCell: (params) => {
        const demandName = params.row.demand?.name;
        const demandHistoryName = params.row.demandHistory?.name;
        return demandName || demandHistoryName || '';
      },
    },
    { field: 'action', headerName: 'Tipo', width: 250, renderCell: (params) =>  typeMapping[params.row.action]  },

  ];

  const typeMapping: Record<string, string> = {
    c: "Adicionar",
    u: "Atualizar",
    d: "Remover",
  };
  

  return (
    <Box >
      {isLoading === true ? <CircularProgress /> :

        <Box height={"90vh"}>
          <ReusableDataGrid columns={columns} rows={data} />
        </Box>
      }

    </Box>
  );
};

export default UnprocessingList;
