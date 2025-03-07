import { fetchData } from "@/connection";
import { Box, CircularProgress, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const ServiceSelector = ({ selectedService, onChange }: { selectedService: number | null, onChange: (id: number) => void }) => {
    const [services, setServices] = useState<{ id: number; name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchData("/services").then(res => {
            setServices(res);
            setIsLoading(false);
        }).catch(error => {
            console.log(error);
            setIsLoading(false);
        });
    }, []);

    return (
        <Box>
            {!isLoading ? (
                <Box>
                    <InputLabel sx={{ml: 1}} id="service">Serviço</InputLabel>
                    <Select
                        sx={{ width: 200, ml: 1 }}
                        size="small"
                        variant="standard"
                        value={selectedService ?? ""}
                        label="Serviço"
                        labelId="service"
                        onChange={(e) => onChange(Number(e.target.value))}
                    >
                        {services.map((service) => (
                            <MenuItem key={service.id} value={service.id}>
                                {service.name}
                            </MenuItem>
                        ))}
                    </Select>

                </Box>
            ) : (
                <CircularProgress />
            )}
        </Box>
    );
};

export default ServiceSelector;
