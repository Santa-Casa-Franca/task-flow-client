import { fetchData } from "@/connection";
import { Box, CircularProgress, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useUnit } from "./UnitProvider";

const TemplateSelector = ({
    selectedService,
    selectedTemplate,
    onChange
}: {
    selectedService: number | null,
    selectedTemplate: number | null,
    onChange: (id: number) => void
}) => {
    const { selectedUnitId } = useUnit();
    const [templates, setTemplates] = useState<{ id: number; name: string; unitId: number }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (selectedService !== null) {
            setIsLoading(true);
            fetchData(`/templates/by-service/${selectedService}`)
                .then(res => {
                    setTemplates(res);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.log(error);
                    setIsLoading(false);
                });
        } else {
            setTemplates([]);
        }
    }, [selectedService]);

    const filteredTemplates = templates.filter(template => template.unitId === selectedUnitId);

    useEffect(() => {
        if (filteredTemplates.length > 0) {
            onChange(filteredTemplates[0].id);
        } else {
            onChange(0);
        }
    }, [filteredTemplates, selectedUnitId, onChange]);

    return (
        <Box>
            {!isLoading ? (
                <Box>
                    <InputLabel sx={{ ml: 1 }} id="template">Template</InputLabel>

                    <Select
                        sx={{ width: 200, ml: 1 }}
                        size="small"
                        variant="standard"
                        value={selectedTemplate ?? ""}
                        labelId="template"
                        onChange={(e) => onChange(Number(e.target.value))}
                        disabled={!selectedService || filteredTemplates.length === 0}
                    >
                        {filteredTemplates.map((template) => (
                            <MenuItem key={template.id} value={template.id}>
                                {template.name}
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

export default TemplateSelector;
