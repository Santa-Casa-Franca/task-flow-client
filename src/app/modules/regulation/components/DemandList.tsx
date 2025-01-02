import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Modal, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { fetchData } from '@/api';
import { GridColDef } from '@mui/x-data-grid';
import ReusableDataGrid from '@/app/componets/ReusableDataGrid';
import { More, ReadMore } from '@mui/icons-material';
import { formatDateTimeToBR, formatDateTimeToBRUTC } from '@/app/utils/formatDate';

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
  changeLogs: Array<ChangeLog>;
}

interface ChangeLog {
  id: number;
  demandId: number;
  field: string;
  oldValue: string;
  newValue: string;
  changedAt: string;
}



const DemandList: React.FC = () => {
  const [data, setData] = useState<Demand[]>([]);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectionErro, setConnectionErro] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true)
        const response = await fetchData('/demands');
        setIsLoading(false)
        setData(response);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setConnectionErro(true)
        setIsLoading(false)
      }
    }

    getData();
  }, []);


  const columns: GridColDef[] = [
    {
      field: 'actions',
      headerName: 'Detalhes',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          startIcon={<ReadMore />}
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleOpenModal(params.row)}
        >
          Detalhes
        </Button>
      ),
    },
    { field: 'name', headerName: 'Nome', width: 250 },
    { field: 'code', headerName: 'Código', width: 100 },
    // { field: 'phone', headerName: 'Telefone', width: 150 },
    { field: 'city', headerName: 'Cidade', width: 130 },
    { field: 'exam', headerName: 'Exame', width: 150 },
    // { field: 'examType', headerName: 'Tipo de Exame', width: 150 },
    { field: 'patientAge', headerName: 'Idade', width: 120 },
    { field: 'entryDate', headerName: 'Data de Entrada', width: 150, renderCell: (params) => formatDateTimeToBRUTC(params.row.entryDate) },
    { field: 'status', headerName: 'Status', width: 250 },
    // { field: 'statusNote', headerName: 'Observação Status', width: 200 }

  ];

  const handleOpenModal = (demand: Demand) => {
    setSelectedDemand(demand);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDemand(null);
    setOpenModal(false);
  };

  const commonStyles = {
    border: 1,
    m: 1,
    borderColor: 'text.primary',
    borderRadius: 2
  };

  return (
    <Box >
      {connectionErro === true && <Alert severity='error' sx={{ fontSize: 20 }}>Erro de conexão com o servidor</Alert>}

      {isLoading === true ? <Box width={"100%"} height={"100%"} mt={4} display={"flex"} alignItems={"center"} justifyContent={"center"}><CircularProgress /></Box> :
        <Box height={"90vh"}>
          <ReusableDataGrid columns={columns} rows={data} />
        </Box>
      }
      

      {selectedDemand && (
        <Box>
          <Modal open={openModal} onClose={handleCloseModal} >
            <Box bgcolor={'white'} display={"flex"} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} sx={{ margin: { xs: 2, sm: 4, md: 6 }, borderRadius: 1 }}>
              <Box borderBottom={"1px solid black"} width={"100%"} bgcolor={"#004cff"} p={1}>
                <Typography variant="body1" width={"100%"} textAlign={"center"} color='white' fontSize={22}><strong>Detalhes da Demanda</strong></Typography>

              </Box>
              <Box display={"flex"} >
                <Box height={200} width={500} sx={{ ...commonStyles, borderLeft: 5 }} >
                  <Box>
                    <Typography borderBottom={'1px solid black'} textAlign={'center'}>PACIENTE</Typography>
                  </Box>
                  <Box p={1}>
                    <Typography variant="body1"><strong>Código:</strong> {selectedDemand.code}</Typography>
                    <Typography variant="body1"><strong>Nome:</strong> {selectedDemand.name}</Typography>
                    <Typography variant="body1"><strong>Cidade:</strong> {selectedDemand.city}</Typography>
                    <Typography variant="body1"><strong>Idade:</strong> {selectedDemand.patientAge}</Typography>
                    <Typography variant="body1"><strong>Telefone:</strong> {selectedDemand.phone}</Typography>
                  </Box>
                </Box>
                <Box height={200} width={500} sx={{ ...commonStyles, borderLeft: 5 }}>
                  <Box>
                    <Typography borderBottom={'1px solid black'} textAlign={'center'}>Exame</Typography>
                  </Box>
                  <Box p={1}>
                    <Typography variant="body1"><strong>Dt de Entrada:</strong> {formatDateTimeToBRUTC(selectedDemand.entryDate)}</Typography>
                    <Typography variant="body1"><strong>Exame:</strong> {selectedDemand.exam}</Typography>
                    <Typography variant="body1"><strong>Tipo de Exame:</strong> {selectedDemand.examType}</Typography>
                    <Typography variant="body1"><strong>Status:</strong> {selectedDemand.status}</Typography>
                    <Typography variant="body1"><strong>Observação Status:</strong> {selectedDemand.statusNote}</Typography>
                  </Box>
                </Box>


              </Box>


              <Typography mt={2} ml={1} variant="body1"><strong>Logs de Mudanças:</strong></Typography>
              {selectedDemand.changeLogs.length > 0 ? (
                <Table sx={{ mt: 2, width: 1020 }}>
                  <TableHead >
                    <TableRow sx={{ bgcolor: 'blue' }}>
                      <TableCell sx={{ color: 'white' }}>Campo</TableCell>
                      <TableCell sx={{ color: 'white' }}>De</TableCell>
                      <TableCell sx={{ color: 'white' }}>Para</TableCell>
                      <TableCell sx={{ color: 'white' }}>Data</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedDemand.changeLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.field}</TableCell>
                        <TableCell>{log.oldValue}</TableCell>
                        <TableCell>{log.newValue}</TableCell>
                        <TableCell>{formatDateTimeToBR(log.changedAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <Typography variant="body2" ml={1} mt={1}>Sem logs de mudanças no momento</Typography>
              )}
            </Box>
          </Modal>
        </Box>

      )}
    </Box>
  );
};

export default DemandList;
