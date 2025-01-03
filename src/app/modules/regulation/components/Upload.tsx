import React, { useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import Papa, { ParseResult } from "papaparse";
import { GridColDef } from "@mui/x-data-grid";
import ReusableDataGrid from "@/app/componets/ReusableDataGrid";
import AddIcon from '@mui/icons-material/Add';
import { PlayArrow } from "@mui/icons-material";
import apiClient from "@/connection/apiClient";
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
    { field: 'code', headerName: 'Código', width: 100 },
    { field: 'phone', headerName: 'Telefone', width: 150, editable: true },
    { field: 'city', headerName: 'Cidade', width: 130, editable: true },
    { field: 'exam', headerName: 'Exame', width: 150, editable: true },
    { field: 'examType', headerName: 'Tipo de Exame', width: 100, editable: true },
    { field: 'patientAge', headerName: 'Idade', width: 120, editable: true },
    { field: 'entryDate', headerName: 'Data de Entrada', width: 150, editable: true },
    { field: 'status', headerName: 'Status', width: 100, editable: true },
    { field: 'statusNote', headerName: 'Observação Status', width: 200, editable: true },

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
    createdCount: number;
    updatedCount: number;
    deletedCount: number;
};

const ProcessingResult: React.FC<ProcessingResultProps> = ({ createdCount, updatedCount, deletedCount }) => {
    return (
        <Box
            border="1px solid #ccc"
            borderRadius="4px"
            bgcolor="#f9f9f9"
            width={470}
        >
            <Typography borderBottom={"1px solid black"} textAlign={"center"} variant="h6" gutterBottom>
                Resultados do Processamento
            </Typography>
            <Box display={"flex"} justifyContent={"space-between"} m={2}>
                <Typography variant="body1">Criados: {createdCount}</Typography>
                <Typography ml={2} variant="body1">Atualizados: {updatedCount}</Typography>
                <Typography ml={2} variant="body1">Deletados: {deletedCount}</Typography>
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
        createdCount: number;
        updatedCount: number;
        deletedCount: number;
    } | null>(null);

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
                if(results.data[0].Nome === ""){
                    setFileData([])
                }else{

                    setFileData(processedData);
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
        const formattedData = fileData.map((item) => ({
            ...item,
            entryDate: moment(item.entryDate, "DD/MM/YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss"),
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
                        {!errorFields && fileData.length >= 0 && <Button onClick={processData} sx={{ ml: 2 }} variant="contained" startIcon={<PlayArrow />}>Processar Planilha</Button>}
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
                    createdCount={processingResult.createdCount}
                    updatedCount={processingResult.updatedCount}
                    deletedCount={processingResult.deletedCount}
                />
            )}
        </Box>
    );
};

export default UploadCSV;
