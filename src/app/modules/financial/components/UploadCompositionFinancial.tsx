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
} from "@mui/material";
import { useUnit } from "./UnitProvider";
import { Send } from "@mui/icons-material";

interface Composition {
    [key: string]: string;
}

const CONFIG: any = {
    campinas: {
        compositionItem: { start: 4, end: 26, headers: ["Conta de Custo", "Valor - R$", "Composição %"], cols: [0, 1, 4] },
        compositionVolume: { start: 29, end: 31, headers: ["Conta de Custo", "Valor - R$", "Composição %"], cols: [0, 1, 4] },
        compositionService: { start: 34, end: 54, headers: ["Linha de Contratação", "Unidade", "Exames", "Valor - R$", "Composição %"], cols: [0, 2, 3, 5, 6] },
        compositionNature: { start: 57, end: 61, headers: ["Natureza Atividade", "Valor - R$", "Composição %"], cols: [0, 1, 4] }
    },
    casaBranca: {
        compositionItem: { start: 5, end: 25, headers: ["Conta", "Valor", "Percentual"], cols: [0, 1, 3] },
        compositionVolume: { start: 28, end: 30, headers: ["Conta", "Valor", "Percentual"], cols: [0, 1, 3] },
        compositionService: { start: 33, end: 53, headers: ["Contrato", "Unidade", "Exames", "Valor", "Percentual"], cols: [0, 2, 3, 5, 6] },
        compositionNature: { start: 56, end: 60, headers: ["Atividade", "Valor", "Percentual"], cols: [0, 1, 3] }
    }
};

const UploadCompositionFinancial: React.FC = () => {
    const { selectedUnit } = useUnit();
    const [unit, setUnit] = useState(selectedUnit);
    const [compositionItem, setCompositionItem] = useState<Composition[]>([]);
    const [compositionVolume, setCompositionVolume] = useState<Composition[]>([]);
    const [compositionService, setCompositionService] = useState<Composition[]>([]);
    const [compositionNature, setCompositionNature] = useState<Composition[]>([]);
    const [tabIndex, setTabIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        handleUnit();
    }, [selectedUnit]);

    const handleUnit = () => {
        setUnit(selectedUnit);
        console.log('unidade trocada', selectedUnit);
        clearData();
    };

    const clearData = () => {
        setCompositionItem([]);
        setCompositionVolume([]);
        setCompositionService([]);
        setCompositionNature([]);
        setTabIndex(0);
        handleFileUpload(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | null) => {
        const file = event?.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const text = iconv.decode(new Buffer(arrayBuffer), "latin1");
            const data = Papa.parse<string[]>(text, { header: false }).data;
            const config = CONFIG[unit];
            setCompositionItem(parseComposition(data, config.compositionItem));
            setCompositionVolume(parseComposition(data, config.compositionVolume));
            setCompositionService(parseComposition(data, config.compositionService));
            setCompositionNature(parseComposition(data, config.compositionNature));
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
        { title: "Composição por Item", data: compositionItem },
        { title: "Composição por Volume", data: compositionVolume },
        { title: "Composição por Serviço", data: compositionService },
        { title: "Composição por Natureza", data: compositionNature }
    ];

    const sendDataToApi = (compositionLists: Composition[][]) => {
        const itemList = [];
        const volumeList = [];
        const serviceList = [];
        const natureList = [];

        const compositionNames = ["Item", "Volume", "Serviço", "Natureza"];

        for (let i = 0; i < compositionLists.length; i++) {
            const listItem = compositionLists[i];
            const compositionName = compositionNames[i];

            for (const item of listItem) {
                const payload = {
                    costAccount: item["Conta de Custo"] || item["Conta"] || item["Linha de Contratação"] || item["Natureza Atividade"],
                    value: item["Valor - R$"] || item["Valor"] || item["Valor"],
                    composition: item["Composição %"] || item["Percentual"] || item["Composição %"],
                };

                if (payload.value) {
                    switch (compositionName) {
                        case "Item":
                            itemList.push(payload);
                            break;
                        case "Volume":
                            volumeList.push(payload);
                            break;
                        case "Serviço":
                            serviceList.push(payload);
                            break;
                        case "Natureza":
                            natureList.push(payload);
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        console.log('Itens por Composição:');
        console.log('Item List:', itemList);
        console.log('Volume List:', volumeList);
        console.log('Service List:', serviceList);
        console.log('Nature List:', natureList);

    };



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

                    <Button variant="outlined" startIcon={<Send />} sx={{ ml: 1 }} color="secondary" onClick={() => sendDataToApi([compositionItem, compositionVolume, compositionService, compositionNature])}>Enviar</Button>
                </Box>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="composition tabs">
                    {compositions.map((composition, index) => (
                        <Tab key={index} label={composition.title} />
                    ))}
                </Tabs>
            </Box>
            <Box mt={1} overflow={"hidden"} >
                <TableContainer component={Paper} style={{ height: "65vh", overflowY: 'auto' }} >
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
            </Box>
        </Box >
    );
};

export default UploadCompositionFinancial;
