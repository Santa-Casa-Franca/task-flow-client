import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress } from '@mui/material';
import { fetchData, putData } from '@/connection';
import { GridColDef } from '@mui/x-data-grid';
import ReusableDataGrid from '@/app/componets/ReusableDataGrid';
import { formatDateTimeToBR } from '@/app/utils/formatDate';
import { AccessTime, Done, Error } from '@mui/icons-material';

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
  const [updatedProcessed, setUpdatedProcessed] = useState(false);

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
  }, [updatedProcessed]);

  const updateProcessed = async (id: number) => {
    try {
      setIsLoading(true)
      await putData(`tasks/${id}/processed`, { processed: false });
      setIsLoading(false);
      setUpdatedProcessed(!updatedProcessed)
    } catch (error) {
      console.log(error);
      setIsLoading(false)

    }
  }

  const columns: GridColDef[] = [
    { field: 'createdAt', headerName: 'Data Processamento', width: 150, renderCell: (params) => formatDateTimeToBR(params.row.createdAt) },
    {
      field: 'name',
      headerName: 'Nome',
      editable: true,
      width: 250,
      renderCell: (params) => {
        const demandName = params.row.demand?.name;
        const demandHistoryName = params.row.demandHistory?.name;
        return demandName || demandHistoryName || '';
      },
    },
    { field: 'type', headerName: 'Tipo', width: 100, renderCell: (params) => typeMapping[params.row.action] },
    {
      field: 'status', headerName: 'Status', width: 100, editable: true, renderCell: (params) => renderStatus(params.row.status)
    },
    {
      field: 'errorMessage', headerName: 'Erro', width: 250, editable: true
    },
    {
      field: 'processed', headerName: 'Processado', width: 90, renderCell: (params) => params.row.processed ? "Sim" : "Não"
    },
    {
      field: "action", headerName: "Ação", width: 110, renderCell: (params) => {
        return <Button disabled={params.row.status !== 'FAILED'} onClick={() => updateProcessed(params.row.id)}>Reprocessar</Button>
      }
    }


  ];

  const renderStatus = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Done color='success' />
      case 'FAILED':
        return <Error color="error" />
      case 'PENDING':
        return <AccessTime color="info" />
      default:
        break;
    }
  }

  const typeMapping: Record<string, string> = {
    c: "Adicionar",
    u: "Atualizar",
    d: "Remover",
  };


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

export default UnprocessingList;
