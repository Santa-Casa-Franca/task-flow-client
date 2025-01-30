import React, { useState } from "react";
import { Alert, Box, Button, CircularProgress, Modal, Typography } from "@mui/material";
import Papa, { ParseResult } from "papaparse";
import { GridColDef } from "@mui/x-data-grid";
import ReusableDataGrid from "@/app/componets/ReusableDataGrid";
import AddIcon from '@mui/icons-material/Add';
import { Add, CheckBox, Close, NotInterested, PlayArrow, RemoveCircleOutline, SettingsApplications, TableView, Upload } from "@mui/icons-material";
import apiClient from "@/connection/apiClient";
import { exportExceptionsToXLSX } from "@/app/utils/export.csv";
const moment = require('moment')

type Data = {
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
};

const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nome', width: 150, editable: true },
    { field: 'code', headerName: 'CNS', width: 100 },
    { field: 'phone', headerName: 'Telefone', width: 150, editable: true },
    { field: 'city', headerName: 'Cidade', width: 130, editable: true },
    { field: 'exam', headerName: 'Exame', width: 150, editable: true },
    { field: 'examType', headerName: 'Tipo de Exame', width: 100, editable: true },
    { field: 'patientAge', headerName: 'Idade', width: 120, editable: true },
    { field: 'entryDate', headerName: 'Data de Entrada', width: 150, editable: true },
    { field: 'status', headerName: 'Status', width: 100, editable: true },
    { field: 'statusNote', headerName: 'Observação Status', width: 200, editable: true },

];

const columnsExceptionEligibility: GridColDef[] = [
    { field: 'code', headerName: 'CNS', width: 100 },
    { field: 'name', headerName: 'Nome', width: 350, editable: true },
];

const expectedColumns = [
    "Nome",
    "Código",
    "Telefone",
    "Município",
    "Exame",
    "Tipo Exame",
    "Idade do Paciente",
    "Data Entrada",
    "Status",
    "Observação Status",
];

type ProcessingResultProps = {
    processed: number;
    createdCount: number;
    updatedCount: number;
    deletedCount: number;
};

const ProcessingResult: React.FC<ProcessingResultProps> = ({ processed, createdCount, updatedCount, deletedCount }) => {
    return (
        <Box
            border="1px solid #ccc"
            borderRadius="5px"
            bgcolor="#f9f9f9"
            width={600}
        >
            <Typography bgcolor={"#004792"} color="white" borderBottom={"1px solid black"} textAlign={"center"} variant="h6" gutterBottom>
                Resultados do Processamento
            </Typography>
            <Box display={"flex"} justifyContent={"space-between"} m={2} flexDirection={"column"}>
                <Box display={"flex"}>
                    <SettingsApplications color="info" />
                    <Typography ml={1} variant="body1">Processados: {processed}</Typography>
                </Box>
                <Box display={"flex"} mt={1}>
                    <Add color="success" />
                    <Typography ml={1} variant="body1">Adicionados: {createdCount}</Typography>
                </Box>

                <Box display={"flex"} mt={1}>
                    <Upload color="info" />
                    <Typography ml={1} variant="body1">Atualizados: {updatedCount}</Typography>
                </Box>

                <Box display={"flex"} mt={1}>
                    <RemoveCircleOutline color="error" />
                    <Typography ml={1} variant="body1">Finalizados: {deletedCount}</Typography>
                </Box>


            </Box>
        </Box>
    );
};

const UploadCSV: React.FC = () => {
    const [fileData, setFileData] = useState<Data[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [errorFields, setErrorFields] = useState(false);
    const [missingFields, setMissiginFields] = useState("");
    const [processingResult, setProcessingResult] = useState<{
        processed: number,
        createdCount: number;
        updatedCount: number;
        deletedCount: number;
    } | null>(null);
    const [open, setOpen] = React.useState(false);
    const [checkingEligibility, setCheckingEligibility] = useState(false);
    const [resEligibility, setResEligibility] = useState<{ eligible: Data[], exceptions: Data[] }>({ eligible: [], exceptions: [] });
    const handleClose = () => setOpen(false);


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setErrorFields(false)
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            parseCSV(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        setProcessingResult(null)
        event.preventDefault();
        setDragActive(false);
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            const file = event.dataTransfer.files[0];
            setSelectedFile(file);
            parseCSV(file);
        }
    };


    const renameColumns = (columns: string[]): string[] => {
        const columnMapping: { [key: string]: string } = {
            "Nome": "name",
            "Código": "code",
            "Telefone": "phone",
            "Município": "city",
            "Exame": "exam",
            "Tipo Exame": "examType",
            "Idade do Paciente": "patientAge",
            "Data Entrada": "entryDate",
            "Status": "status",
            "Observação Status": "statusNote"
        };

        return columns.map((col) => {
            const trimmedCol = col.trim();
            const renamedCol = columnMapping[trimmedCol] || trimmedCol;
            return renamedCol
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9]/g, "_")
        });
    };


    const parseCSV = (file: File) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            encoding: "ISO-8859-1",
            complete: (results: ParseResult<any>) => {
                const fileColumns = Object.keys(results.data[0] || {});
                const missingColumns = expectedColumns.filter(
                    (expectedCol) => !fileColumns.includes(expectedCol)
                );

                if (missingColumns.length > 0) {
                    setMissiginFields(missingColumns.join(', '))
                    setErrorFields(true)
                    return;
                }

                const renamedColumns = renameColumns(fileColumns);

                const processedData = results.data.map((row: any) => {
                    const newRow: any = {};
                    renamedColumns.forEach((newCol, index) => {
                        const originalCol = Object.keys(results.data[0])[index];
                        newRow[newCol] = row[originalCol];
                    });
                    return newRow;
                });
                const filteredData = processedData.filter(item => item.code !== "")
                if (results.data[0].Nome === "") {
                    setFileData([])
                } else {

                    setFileData(filteredData);
                }
            },
        });
    };

    const newFile = () => {
        setErrorFields(false);
        setSelectedFile(null);
        setProcessingResult(null);
        setFileData([])
    }

    const processData = () => {
        handleClose();
        const formattedData = resEligibility.eligible.map((item) => ({
            ...item
        }));

        apiClient.post('/demands', formattedData)
            .then((res) => {
                setFileData([])
                setProcessingResult(res.data);

            })
            .catch((error) => {
                console.error('Erro ao enviar os dados', error);
            });
    };

    const checkEligibility = () => {
        const formattedData = fileData.map((item) => ({
            ...item,
            entryDate: moment(item.entryDate, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
        }));
        apiClient.post('demands/check-eligibility', formattedData).then(res => {
            setResEligibility(res.data)
            setCheckingEligibility(false)
        }).catch((error) => {
            setCheckingEligibility(false)

            console.error('Erro ao verificar elegibilidade', error);
        });
    }

    const exportXLSX = (items: any[]) => {
        const remap = items.map(item => {
            return {
                CNS: item.code,
                NOME: item.name
            }
        })
        exportExceptionsToXLSX(remap, `cns_nao_encontrados_${moment(new Date()).format("DD_MM_YYYY HH:mm:ss")}`)
    }

    const handleOpen = () => {
        setCheckingEligibility(true)
        setOpen(true);
        checkEligibility();
        setCheckingEligibility(false)

    }
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        border: '2px solid #004792',
        boxShadow: 24,
        borderRadius: 2
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={2}
            border="1px dashed gray"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{ backgroundColor: dragActive ? "#f0f0f0" : "transparent" }}
        >
            {selectedFile === null && <Box>
                <Box mb={2}>
                    <Button variant="contained" component="label">
                        Selecione o arquivo
                        <input
                            type="file"
                            accept=".csv"
                            hidden
                            onChange={handleFileChange}
                        />
                    </Button>
                </Box>
                <Typography variant="body2" color="textSecondary">
                    Ou arraste e solte o arquivo
                </Typography>
            </Box>}

            {selectedFile && (
                <Box mt={2}>
                    <Typography variant="body1">
                        Arquivo selecionado: {selectedFile.name}
                    </Typography>
                    <Box m={2}>
                        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => newFile()}>Novo arquivo</Button>
                        {!errorFields && fileData.length > 0 && <Button onClick={handleOpen} sx={{ ml: 2 }} variant="contained" startIcon={<PlayArrow />}>Verificar</Button>}
                        {/* {!errorFields && fileData.length >= 0 && <Button onClick={processData} sx={{ ml: 2 }} variant="contained" startIcon={<PlayArrow />}>Processar Planilha</Button>} */}
                    </Box>
                </Box>
            )}
            {errorFields && <Alert severity="warning">Erro na validação. Por favor verifique os campos: {missingFields}</Alert>}
            {fileData.length > 0 && (
                <Box height={"65vh"} width={"100%"}>
                    <ReusableDataGrid columns={columns} rows={fileData} />
                </Box>

            )}
            {processingResult && (
                <ProcessingResult
                    processed={processingResult.processed}
                    createdCount={processingResult.createdCount}
                    updatedCount={processingResult.updatedCount}
                    deletedCount={processingResult.deletedCount}
                />
            )}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {checkingEligibility === true ? <CircularProgress /> :
                        <Box p={4}>
                            <Box display={"flex"} p={2} borderBottom={"1px solid #004792"}>
                                <Box display={"flex"} alignItems={"center"}>
                                    <SettingsApplications color="info" />
                                    <Typography ml={1} fontSize={20}>Processados: {resEligibility.eligible.length + resEligibility.exceptions.length}</Typography>
                                </Box>
                                <Box ml={2} display={"flex"} alignItems={"center"}>
                                    <CheckBox color="success" />
                                    <Typography ml={1} fontSize={20}>Aptos: {resEligibility.eligible.length}</Typography>
                                </Box>
                                <Box ml={2} display={"flex"} alignItems={"center"}>
                                    <NotInterested color="error" />
                                    <Typography ml={1} fontSize={20}> Inaptos: {resEligibility.exceptions.length} </Typography>
                                </Box>
                            </Box>
                            <Box height={"60vh"} width={"100%"} mt={2}>
                                <Typography mb={1} fontSize={18}>CNS não encontrados no TASY</Typography>
                                <ReusableDataGrid columns={columnsExceptionEligibility} rows={resEligibility.exceptions} />
                            </Box>
                            <Box>
                                <Button startIcon={<TableView />} variant="outlined" onClick={() => exportXLSX(resEligibility.exceptions)}>Exportar Inaptos</Button>
                                <Button sx={{ ml: 1 }} startIcon={<PlayArrow />} variant="contained" onClick={processData}>Processar</Button>
                                <Button sx={{ ml: 1 }} startIcon={<Close />} variant="contained" color="error" onClick={handleClose} >Fechar</Button>
                            </Box>

                        </Box>
                    }
                </Box>
            </Modal>
        </Box>
    );
};

export default UploadCSV;
