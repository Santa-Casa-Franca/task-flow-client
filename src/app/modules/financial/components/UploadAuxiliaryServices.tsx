import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import iconv from "iconv-lite";
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
        service: { start: 4, end: 28, headers: ["Centro de custo", "Qtde. Equip.", "Qtde. (Prod.)", "Custo unitário"], cols: [0, 1, 2, 3] },
    },
    casaBranca: {
        assistance: { start: 6, end: 25, headers: ["Centro de custo", "Exame", "Procedimento", "Qtde. Consultas", "Custo unitário s/ Exame", "Custo total s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Custo total c/ Exame"], cols: [0, 1, 5, 9, 11, 15, 18, 21, 24] },
        notDoctor: { start: 30, end: 36, headers: ["Centro de custo", "Nº de Consultas", "Nº de Sessões", "Total", "Custo unitário s/ Exame", "Total Custo unitário s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Total Custo unitário c/ Exame"], cols: [0, 2, 3, 6, 10, 13, 16, 19, 23] },
    },
    ribeiraoPreto: {
        assistance: { start: 6, end: 25, headers: ["Centro de custo", "Exame", "Procedimento", "Qtde. Consultas", "Custo unitário s/ Exame", "Custo total s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Custo total c/ Exame"], cols: [0, 1, 5, 9, 11, 15, 18, 21, 24] },
        notDoctor: { start: 30, end: 36, headers: ["Centro de custo", "Nº de Consultas", "Nº de Sessões", "Total", "Custo unitário s/ Exame", "Total Custo unitário s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Total Custo unitário c/ Exame"], cols: [0, 2, 3, 6, 10, 13, 16, 19, 23] },
    },
    campinas: {
        assistance: { start: 6, end: 25, headers: ["Centro de custo", "Exame", "Procedimento", "Qtde. Consultas", "Custo unitário s/ Exame", "Custo total s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Custo total c/ Exame"], cols: [0, 1, 5, 9, 11, 15, 18, 21, 24] },
        notDoctor: { start: 30, end: 36, headers: ["Centro de custo", "Nº de Consultas", "Nº de Sessões", "Total", "Custo unitário s/ Exame", "Total Custo unitário s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Total Custo unitário c/ Exame"], cols: [0, 2, 3, 6, 10, 13, 16, 19, 23] },
    },
    jurumirim: {
        assistance: { start: 6, end: 25, headers: ["Centro de custo", "Exame", "Procedimento", "Qtde. Consultas", "Custo unitário s/ Exame", "Custo total s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Custo total c/ Exame"], cols: [0, 1, 5, 9, 11, 15, 18, 21, 24] },
        notDoctor: { start: 30, end: 36, headers: ["Centro de custo", "Nº de Consultas", "Nº de Sessões", "Total", "Custo unitário s/ Exame", "Total Custo unitário s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Total Custo unitário c/ Exame"], cols: [0, 2, 3, 6, 10, 13, 16, 19, 23] },
    },
    saoCarlos: {
        assistance: { start: 6, end: 25, headers: ["Centro de custo", "Exame", "Procedimento", "Qtde. Consultas", "Custo unitário s/ Exame", "Custo total s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Custo total c/ Exame"], cols: [0, 1, 5, 9, 11, 15, 18, 21, 24] },
        notDoctor: { start: 30, end: 36, headers: ["Centro de custo", "Nº de Consultas", "Nº de Sessões", "Total", "Custo unitário s/ Exame", "Total Custo unitário s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Total Custo unitário c/ Exame"], cols: [0, 2, 3, 6, 10, 13, 16, 19, 23] },
    },
    taquaritinga: {
        assistance: { start: 6, end: 25, headers: ["Centro de custo", "Exame", "Procedimento", "Qtde. Consultas", "Custo unitário s/ Exame", "Custo total s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Custo total c/ Exame"], cols: [0, 1, 5, 9, 11, 15, 18, 21, 24] },
        notDoctor: { start: 30, end: 36, headers: ["Centro de custo", "Nº de Consultas", "Nº de Sessões", "Total", "Custo unitário s/ Exame", "Total Custo unitário s/ Exame", "Nº de Exames", "Custo unitário c/ Exame", "Total Custo unitário c/ Exame"], cols: [0, 2, 3, 6, 10, 13, 16, 19, 23] },
    },

};

type Processed = {
    visible: boolean,
    severity: string,
    message: string
}

const UploadAuxiliaryServices: React.FC<{ serviceId: number, templateId: number }> = ({ serviceId, templateId }) => {
    const { selectedUnitValue, selectedUnitId } = useUnit();
    const [unit, setUnit] = useState(selectedUnitValue);
    const [service, setService] = useState<Composition[]>([]);

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
        setService([]);
        setTabIndex(0);
        handleFileUpload(null);
        setProcessed({ visible: false, severity: "", message: "" })
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | null) => {
        setProcessed({ visible: false, severity: "", message: "" })
        const file = event?.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const text = iconv.decode(new Buffer(arrayBuffer), "latin1");
            const data = Papa.parse<string[]>(text, { header: false, skipEmptyLines: true, dynamicTyping: true }).data;
            const config = CONFIG[unit || "casaBranca"];
            setService(parseComposition(data, config.service));
        };
        reader.readAsArrayBuffer(file);
    };

    const parseComposition = (data: string[][], config: any): Composition[] => {
        return data.slice(config.start, config.end + 1).map((row) => {
            return config.headers.reduce((acc: { [x: string]: string; }, header: string | number, i: string | number) => {
                acc[header] = row[config.cols[i]] || "";
                return acc;
            }, {} as Composition);
        });
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    const compositions = [
        { title: "Serviços", data: service },
    ];

    const sendDataToApi = async (compositionLists: Composition[][]) => {
        if (!fileInputRef?.current?.value) {
            setProcessed({ message: "Por favor selecione uma planilha para processamento", severity: "warning", visible: true });
            return
        } else {
            setIsLoading(true);
            const serviceList = [];

            const compositionNames = ["Serviços"];

            for (let i = 0; i < compositionLists.length; i++) {
                const listItem = compositionLists[i];
                const compositionName = compositionNames[i];
                for (const item of listItem) {
                    const payload = {
                        costAccount: item["Centro de custo"],
                        quantityOfEquipment: item["Qtde. Equip."],
                        quantity: item["Qtde. (Prod.)"],
                        unitCost: item["Custo unitário"],
                    };

                    switch (compositionName) {
                        case "Serviços":
                            serviceList.push(payload);
                            break;
                        default:
                            break;
                    }
                    // }
                }
            }

            const lista: { [x: string]: { value: string }[] }[] = []
            for (const element of serviceList) {
                const keyword = element.costAccount;
                // if (!keyword) continue;

                const fields = [
                    { key: "costAccount", value: element.costAccount },
                    { key: "quantityOfEquipment", value: element.quantityOfEquipment },
                    { key: "quantity", value: element.quantity },
                    { key: "unitCost", value: element.unitCost },
                ];

                for (const { key, value } of fields) {
                    lista.push({ [`${keyword}-${key}`]: [{ value }] });
                }
            }


            const uploadFilePayload = {
                "filename": fileInputRef.current?.value.split("\\")[2],
                "serviceId": serviceId,
                "unitId": Number(selectedUnitId),
                "templateId": templateId
            }


            try {
                const res = await postData("/uploaded-files", uploadFilePayload)
                const uploadId = res.id;
                const extractedData = {
                    "fileId": uploadId,
                    "templateId": templateId,
                    "serviceId": serviceId,
                    "data": [
                        ...lista
                    ]
                }

                console.log('extractedData', extractedData)
                await postData("/extracted-data", extractedData);
                setProcessed({ visible: true, message: "Dados enviado com sucesso", severity: "success" })
                setIsLoading(false);

            } catch (error) {
                console.log(error);
                setProcessed({ visible: true, message: "Falha ao enviar os dados para processamento", severity: "error" });
                setIsLoading(false);
            }


        }



    };

    const renderAlert = () => {
        const { severity, message, visible } = processed;
        return (
            <Box mt={1}>
                {visible === true && <Alert variant="standard" severity={severity === 'success' ? "success" : severity === 'warning' ? "warning" : "error"}>
                    {message}
                </Alert>}
            </Box>

        )
    }

    return (
        <Box bgcolor={"white"} >
            <Box >
                <Box height={50} display="flex" alignItems="center" >
                    <Box ml={1}>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            ref={fileInputRef}
                        />
                    </Box>

                    <Button variant="outlined" startIcon={<Send />} sx={{ ml: 1 }} color="secondary" onClick={() => sendDataToApi([service])}>Enviar</Button>

                </Box>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="composition tabs">
                    {compositions.map((composition, index) => (
                        <Tab key={index} label={composition.title} />
                    ))}
                </Tabs>
            </Box>
            <Box overflow={"hidden"} >
                {isLoading === true && <Box width={"100%"} display={"flex"} justifyContent={"center"}><CircularProgress color="secondary" /></Box>}

                {processed.visible === false && <TableContainer component={Paper} style={{ height: "65vh", overflowY: 'auto' }} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                {Object.keys(compositions[tabIndex]?.data[0] || {}).map((key) => (
                                    <TableCell size="small" key={key} sx={{ bgcolor: "#1976D2", color: "white" }} style={{ fontWeight: 'bold' }}>
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
                }
                {renderAlert()}
            </Box>
        </Box >
    );
};

export default UploadAuxiliaryServices;
