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
        compositionItem: { start: 0, end: 97, headers: ["Conta financeira", "Apresentação", "Primeiro", "Segundo", "Terceiro", "quarto", "quinto", "sexto", "setimo", "oitavo", "nono", "decimo", "decimo primeiro", "decimo segundo", "decimo terceiro"], cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    },
    ribeiraoPreto: {
        compositionItem: { start: 0, end: 97, headers: ["Conta financeira", "Apresentação", "Primeiro", "Segundo", "Terceiro", "quarto", "quinto", "sexto", "setimo", "oitavo", "nono", "decimo", "decimo primeiro", "decimo segundo", "decimo terceiro"], cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    },
    casaBranca: {
        compositionItem: { start: 0, end: 97, headers: ["Conta financeira", "Apresentação", "Primeiro", "Segundo", "Terceiro", "quarto", "quinto", "sexto", "setimo", "oitavo", "nono", "decimo", "decimo primeiro", "decimo segundo", "decimo terceiro"], cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    },
    taquaritinga: {
        compositionItem: { start: 0, end: 97, headers: ["Conta financeira", "Apresentação", "Primeiro", "Segundo", "Terceiro", "quarto", "quinto", "sexto", "setimo", "oitavo", "nono", "decimo", "decimo primeiro", "decimo segundo", "decimo terceiro"], cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    },
    jurumirim: {
        compositionItem: { start: 0, end: 97, headers: ["Conta financeira", "Apresentação", "Primeiro", "Segundo", "Terceiro", "quarto", "quinto", "sexto", "setimo", "oitavo", "nono", "decimo", "decimo primeiro", "decimo segundo", "decimo terceiro"], cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    },
    saoCarlos: {
        compositionItem: { start: 0, end: 97, headers: ["Conta financeira", "Apresentação", "Primeiro", "Segundo", "Terceiro", "quarto", "quinto", "sexto", "setimo", "oitavo", "nono", "decimo", "decimo primeiro", "decimo segundo", "decimo terceiro"], cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    },
    campinas: {
        compositionItem: { start: 0, end: 97, headers: ["Conta financeira", "Apresentação", "Primeiro", "Segundo", "Terceiro", "quarto", "quinto", "sexto", "setimo", "oitavo", "nono", "decimo", "decimo primeiro", "decimo segundo", "decimo terceiro"], cols: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
    },
};

type Processed = {
    visible: boolean;
    severity: string;
    message: string;
};

const UploadCashFlow: React.FC<{ serviceId: number; templateId: number }> = ({
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

    const formatToPTBR = (value: any) => {
        if (typeof value === "number") {
            const positiveValue = Math.abs(value); // Transforma em positivo
            return positiveValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
        } else if (typeof value === "string") {
            const numericValue = parseFloat(value.replace(",", "."));
            if (!isNaN(numericValue)) {
                const positiveValue = Math.abs(numericValue);
                return positiveValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
            }
            return value.replace(".", ","); 
        }
        return String(value);
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
        let headers = [...config.headers]; // Mantém os cabeçalhos padrões

        const firstRow = data[config.start] || [];
        const dynamicHeaders = firstRow.slice(2, 15).map((cell, i) => {
            if (typeof cell === "number") {
                const date = XLSX.SSF.parse_date_code(cell);
                if (date) {
                    return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
                        .format(new Date(date.y, date.m - 1, date.d))
                        .replace(".", "").toUpperCase();
                }
            }
            return cell || `Coluna ${i + 3}`;
        });

        headers.splice(2, dynamicHeaders.length, ...dynamicHeaders);

        return data.slice(config.start + 1, config.end + 1).map((row) => {
            return headers.reduce((acc: { [x: string]: string }, header: string, i: number) => {
                acc[header] = row[config.cols[i]] ?? "";
                return acc;
            }, {} as Composition);
        });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const compositions = [{ title: "Fluxo de Caixa", data: compositionItem }];

    const sendDataToApi = async (compositionLists: Composition[][]) => {
        if (!fileInputRef?.current?.value) {
            setProcessed({ message: "Por favor, selecione um arquivo para processamento", severity: "warning", visible: true });
            return;
        }

        setIsLoading(true);

        const itemList = [];

        for (const listItem of compositionLists[0]) {
            const payload = {
                costAccount: String(listItem[Object.keys(listItem)[0]] || ""),
                value: formatToPTBR(listItem[Object.keys(listItem)[14]] || ""),
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

export default UploadCashFlow;
