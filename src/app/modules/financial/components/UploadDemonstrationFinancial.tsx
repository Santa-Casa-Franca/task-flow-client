import React, { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx"; // Importa a biblioteca para lidar com .xlsx
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Tabs,
    Tab,
    Button,
    Alert,
    CircularProgress
} from "@mui/material";
import { useUnit } from "./UnitProvider";
import { Send } from "@mui/icons-material";
import { postData } from "@/connection";

interface Composition {
    [key: string]: string;
}

const CONFIG: any = {
    franca: {
        compositionItem: { start: 22, end: 56, headers: ["Despesas Operacionais", "Valor - R$"], cols: [0, 1] },
    },
};

type Processed = {
    visible: boolean;
    severity: string;
    message: string;
};

const UploadDemonstrationFinancial: React.FC<{ serviceId: number; templateId: number }> = ({
    serviceId,
    templateId
}) => {
    const { selectedUnitValue, selectedUnitId } = useUnit();
    const [unit, setUnit] = useState(selectedUnitValue);
    const [compositionItem, setCompositionItem] = useState<Composition[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [processed, setProcessed] = useState<Processed>({ visible: false, severity: "", message: "" });

    useEffect(() => {
        handleUnit();
    }, [selectedUnitValue]);

    const handleUnit = () => {
        setUnit(selectedUnitValue);
        clearData();
    };

    const clearData = () => {
        setCompositionItem([]);
        setTabIndex(0);
        setProcessed({ visible: false, severity: "", message: "" });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | null) => {
        setProcessed({ visible: false, severity: "", message: "" });
        const file = event?.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const config = CONFIG[unit || "franca"];
            setCompositionItem(parseComposition(jsonData, config.compositionItem));
        };
        reader.readAsArrayBuffer(file);
    };

    const parseComposition = (data: string[][], config: any): Composition[] => {
        return data.slice(config.start, config.end + 1).map((row) => {
            return config.headers.reduce((acc: { [x: string]: string }, header: string | number, i: string | number) => {
                acc[header] = row[config.cols[i]] ?? "";
                return acc;
            }, {} as Composition);
        });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const compositions = [{ title: "Demonstração Contábil", data: compositionItem }];

    const sendDataToApi = async (compositionLists: Composition[][]) => {
        if (!fileInputRef?.current?.value) {
            setProcessed({ message: "Por favor, selecione um arquivo para processamento", severity: "warning", visible: true });
            return;
        }

        setIsLoading(true);
        const itemList = [];

        for (const listItem of compositionLists[0]) {
            const payload = {
                costAccount: String(listItem["Despesas Operacionais"] || ""),
                value: String(listItem["Valor - R$"] || ""),
            };
            

            if (payload.value) {
                itemList.push(payload);
            }
        }

        const lista: { [x: string]: { value: string }[] }[] = [];
        for (const element of itemList) {
            const keyword = element.costAccount;
            if (keyword) {
                lista.push({ [keyword]: [{ value: element.value }] });
            }
        }

        const uploadFilePayload = {
            filename: fileInputRef.current?.value.split("\\").pop(),
            serviceId: serviceId,
            unitId: Number(selectedUnitId),
            templateId: templateId
        };

        console.log(lista);

        try {
            const res = await postData("/uploaded-files", uploadFilePayload)
            const uploadId = res.id;
            const extractedData = {
                "fileId": uploadId,
                "templateId": templateId,
                "serviceId": serviceId,
                "data": [...lista]
            }

            await postData("/extracted-data", extractedData);
            setProcessed({ visible: true, message: "Dados enviados com sucesso", severity: "success" });
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            setProcessed({ visible: true, message: "Falha ao enviar os dados para processamento", severity: "error" });
            setIsLoading(false);
        }
    };

    const renderAlert = () => {
        const { severity, message, visible } = processed;
        return visible ? (
            <Box mt={1}>
                <Alert variant="standard" severity="info">
                    {message}
                </Alert>
            </Box>
        ) : null;
    };

    return (
        <Box bgcolor={"white"}>
            <Box>
                <Box height={50} display="flex" alignItems="center">
                    <Box ml={1}>
                        <input type="file" accept=".xlsx" onChange={handleFileUpload} ref={fileInputRef} />
                    </Box>
                    <Button variant="outlined" startIcon={<Send />} sx={{ ml: 1 }} color="secondary" onClick={() => sendDataToApi([compositionItem])}>
                        Enviar
                    </Button>
                </Box>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="composition tabs">
                    {compositions.map((composition, index) => (
                        <Tab key={index} label={composition.title} />
                    ))}
                </Tabs>
            </Box>
            <Box overflow={"hidden"}>
                {isLoading && <Box width="100%" display="flex" justifyContent="center"><CircularProgress color="secondary" /></Box>}
                {!processed.visible && (
                    <TableContainer component={Paper} style={{ height: "65vh", overflowY: "auto" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {Object.keys(compositions[tabIndex]?.data[0] || {}).map((key) => (
                                        <TableCell size="small" key={key} sx={{ bgcolor: "#1976D2", color: "white", fontWeight: "bold" }}>
                                            {key}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {compositions[tabIndex]?.data.map((item, index) => (
                                    <TableRow key={index}>
                                        {Object.values(item).map((value, idx) => (
                                            <TableCell size="small" key={idx}>{value}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {renderAlert()}
            </Box>
        </Box>
    );
};

export default UploadDemonstrationFinancial;
