import React, { useState } from "react";
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
    Tab
} from "@mui/material";

interface Composition {
    [key: string]: string;
}

const UploadCompositionFinancial: React.FC = () => {
    const [compositionItem, setCompositionItem] = useState<Composition[]>([]);
    const [compositionVolume, setCompositionVolume] = useState<Composition[]>([]);
    const [compositionService, setCompositionService] = useState<Composition[]>([]);
    const [compositionNature, setCompositionNature] = useState<Composition[]>([]);
    const [tabIndex, setTabIndex] = useState(0);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const text = iconv.decode(new Buffer(arrayBuffer), "latin1");
            const data = Papa.parse<string[]>(text, { header: false }).data;
            setCompositionItem(parseComposition(data, 4, 26, ["Conta de Custo", "Valor - R$", "Composição %"], [0, 1, 4]));
            setCompositionVolume(parseComposition(data, 29, 31, ["Conta de Custo", "Valor - R$", "Composição %"], [0, 1, 4]));
            setCompositionService(parseComposition(data, 34, 54, ["Linha de Contratação", "Unidade", "Exames", "Valor - R$", "Composição %"], [0, 2, 3, 5, 6]));
            setCompositionNature(parseComposition(data, 57, 61, ["Natureza Atividade", "Valor - R$", "Composição %"], [0, 1, 4]));
        };
        reader.readAsArrayBuffer(file);
    };

    const parseComposition = (data: string[][], start: number, end: number, headers: string[], cols: number[]): Composition[] => {
        return data.slice(start, end + 1).map((row) => {
            return headers.reduce((acc, header, i) => {
                acc[header] = row[cols[i]] || "";
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

    return (
        <Box height={"65vh"} >
            <Box height={70}>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="composition tabs">
                    {compositions.map((composition, index) => (
                        <Tab key={index} label={composition.title} />
                    ))}
                </Tabs>
            </Box>
            <Box mt={1} overflow={"auto"} height={"55vh"}>

                <TableContainer component={Paper} >
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
        </Box>
    );
};

export default UploadCompositionFinancial;
