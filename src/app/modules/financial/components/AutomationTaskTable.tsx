import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    TextField, Select, MenuItem, Pagination, Typography, CircularProgress,
    Box
} from "@mui/material";
import { fetchData } from "@/connection";

const fetchTasks = async (params: any) => {
    const { data } = await fetchData("/automation-tasks", params);
    return data;
};

export default function AutomationTaskTable() {
    const [filters, setFilters] = useState({
        serviceId: "",
        status: "pendente",
        templateId: "",
        page: 1,
        limit: 5,
    });

    const { data, isLoading, error } = useQuery({
        queryKey: ["automation-tasks", filters],
        queryFn: () => fetchTasks({ ...filters }),
    });


    const handleChange = (e: any) => {
        setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
    };

    const handlePageChange = (_: any, value: number) => {
        setFilters({ ...filters, page: value });
    };

    return (
        <Paper sx={{ padding: 3, }} >
            <Typography variant="h6" gutterBottom>
                Tarefas Automatizadas
            </Typography>

            <Box sx={{ display: "flex", gap: 8, mb: 2, mt: -2, height: 30, alignItems: "baseline" }}>
                <TextField
                    label="Service ID"
                    name="serviceId"
                    value={filters.serviceId}
                    onChange={handleChange}
                    variant="standard"
                />
                <Select
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    displayEmpty
                    variant="standard"
                >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="pendente">Pendente</MenuItem>
                    <MenuItem value="concluido">Concluído</MenuItem>
                </Select>
                <TextField
                    label="Template ID"
                    name="templateId"
                    value={filters.templateId}
                    onChange={handleChange}
                    variant="standard"

                />
                <Select
                    name="limit"
                    value={filters.limit}
                    onChange={handleChange}
                    variant="standard"

                >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>

            </Box>

            <Box overflow={"auto"} height={"60vh"}>
                <TableContainer component={Paper} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Arquivo</TableCell>
                                <TableCell>Template</TableCell>
                                <TableCell>Serviço</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Criado em</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : error ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        Erro ao carregar dados
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data?.map((task: any) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{task.id}</TableCell>
                                        <TableCell>{task.uploadedFile?.filename}</TableCell>
                                        <TableCell>{task.template?.name}</TableCell>
                                        <TableCell>{task.service?.name}</TableCell>
                                        <TableCell>{task.status}</TableCell>
                                        <TableCell>{new Date(task.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Pagination
                count={data?.totalPages || 1}
                page={filters.page}
                onChange={handlePageChange}
                sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
            />
        </Paper>
    );
}
