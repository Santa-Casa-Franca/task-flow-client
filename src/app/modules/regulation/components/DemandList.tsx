import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Modal, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { fetchData } from '@/connection';
import { GridColDef } from '@mui/x-data-grid';
import ReusableDataGrid from '@/app/componets/ReusableDataGrid';
import { Biotech, Close, HourglassBottom, More, PersonAddAlt, ReadMore } from '@mui/icons-material';
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
    { field: 'name', headerName: 'Nome', width: 250, editable: true },
    { field: 'code', headerName: 'Código', width: 100 },
    // { field: 'phone', headerName: 'Telefone', width: 150 },
    { field: 'city', headerName: 'Cidade', width: 130 },
    { field: 'exam', headerName: 'Exame', width: 150 },
    // { field: 'examType', headerName: 'Tipo de Exame', width: 150 },
    { field: 'patientAge', headerName: 'Idade', width: 120 },
    { field: 'entryDate', headerName: 'Data de Entrada', width: 150, renderCell: (params) => formatDateTimeToBRUTC(params.row.entryDate) },
    { field: 'status', headerName: 'Status', width: 250, editable: true },
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

  return (
    <Box >
      {connectionErro === true && <Alert severity='error' sx={{ fontSize: 20 }}>Erro de conexão com o servidor</Alert>}

      {isLoading === true ? <Box width={"100%"} height={"100%"} mt={4} display={"flex"} alignItems={"center"} justifyContent={"center"}><CircularProgress /></Box> :
        <Box height={"80vh"}>
          <ReusableDataGrid columns={columns} rows={data} />
        </Box>
      }


      {selectedDemand && (
        <Box>
          <Modal open={openModal} onClose={handleCloseModal} >
            <Box bgcolor={'#fff'} display={"flex"} borderRadius={5} justifyContent={"center"} flexDirection={"column"} alignItems={"center"} sx={{ margin: { xs: 2, sm: 4, md: 6 }, borderRadius: 1 }}>
              <Box borderBottom={"1px solid black"} width={"100%"} bgcolor={"#004792"} >
                <Typography variant="body1" width={"100%"} textAlign={"center"} color='white' fontSize={22}><strong>Detalhes da Demanda</strong></Typography>

              </Box>
              <Box bgcolor={'#DBEAFE'} width={"100%"} display={"flex"}>
                <Box height={200} p={1} minWidth={"30%"} >
                  <Box display={"flex"} alignItems={"center"}>
                    <PersonAddAlt />
                    <Typography fontSize={22} fontWeight={700} ml={"3px"} textAlign={'start'}>PACIENTE</Typography>
                  </Box>
                  <Box mt={1}>
                    <Typography variant="body1"><strong>Código:</strong> {selectedDemand.code}</Typography>
                    <Typography variant="body1"><strong>Nome:</strong> {selectedDemand.name}</Typography>
                    <Typography variant="body1"><strong>Cidade:</strong> {selectedDemand.city}</Typography>
                    <Typography variant="body1"><strong>Idade:</strong> {selectedDemand.patientAge}</Typography>
                    <Typography variant="body1"><strong>Telefone:</strong> {selectedDemand.phone}</Typography>
                  </Box>
                </Box>
                <Box height={200} m={1} pl={1} borderLeft={"1px solid black"} >
                  <Box display={"flex"} alignItems={"center"}>
                    <Biotech />
                    <Typography fontSize={22} fontWeight={700} textAlign={'start'}>Exame</Typography>
                  </Box>
                  <Box mt={1}>
                    <Typography variant="body1"><strong>Dt de Entrada:</strong> {formatDateTimeToBRUTC(selectedDemand.entryDate)}</Typography>
                    <Typography variant="body1"><strong>Exame:</strong> {selectedDemand.exam}</Typography>
                    <Typography variant="body1"><strong>Tipo de Exame:</strong> {selectedDemand.examType}</Typography>
                    <Typography variant="body1"><strong>Status:</strong> {selectedDemand.status}</Typography>
                    <Typography variant="body1"><strong>Observação Status:</strong> {selectedDemand.statusNote}</Typography>
                  </Box>
                </Box>
              </Box>

              {selectedDemand.changeLogs.length > 0 ?
                <Box height={310} width={"100%"} overflow={"auto"}>
                  <Typography mt={1} variant="body1" fontWeight={20}><strong>Logs de Mudanças:</strong></Typography>
                  <Table sx={{ mt: 1, mb:1, width: 1020 }}>
                    <TableHead >
                      <TableRow sx={{ bgcolor: '#004792', }} >
                        <TableCell size='small' sx={{ fontWeight: 700, color: 'white', borderLeft: "2px solid #004792", borderTop: "1px solid #004792", borderBottom: "1px solid #004792" }}>Campo</TableCell>
                        <TableCell size='small' sx={{ fontWeight: 700, color: 'white', borderTop: "1px solid #004792", borderBottom: "1px solid #004792" }}>Para</TableCell>
                        <TableCell size='small' sx={{ fontWeight: 700, color: 'white', borderRight: "2px solid #004792", borderTop: "1px solid #004792", borderBottom: "1px solid #004792" }}>Data</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedDemand.changeLogs.map((log) => (
                        <TableRow key={log.id} >
                          <TableCell size='small' sx={{ border: "1px solid #004792" }}>{log.oldValue}</TableCell>
                          <TableCell size='small' sx={{ border: "1px solid #004792" }}>{log.newValue}</TableCell>
                          <TableCell size='small' sx={{ border: "1px solid #004792" }}>{formatDateTimeToBR(log.changedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
                :
                <Box my={1} display={"flex"}>
                  <HourglassBottom color='info' />
                  <Typography color='#004792' >Ainda não há logs de mudanças</Typography>
                </Box>
              }
              <Box width={"100%"} display={"flex"} justifyContent={"flex-end"} py={1} px={2} borderTop={"1px solid #004792"}>
                <Button startIcon={<Close />} variant='contained' color='error' onClick={() => setSelectedDemand(null)}>Fechar</Button>
              </Box>
            </Box>
          </Modal>
        </Box>

      )}
    </Box>
  );
};

export default DemandList;
