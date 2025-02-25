import React, { useState } from "react";
import { Box, Button,  Step, StepLabel, Stepper } from "@mui/material";
import UploadCompositionFinancial from "./UploadCompositionFinancial";

const steps = ["Composição dos Custos", "Receitas e Despesas", "Outro Arquivo", "Outro Tipo", "Outro Formulário"];

const UploadStepper: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const renderUploadComponent = (step: number) => {
        switch (step) {
            case 0:
                return <UploadCompositionFinancial />;
            case 1:
                return "tsete";
            // Adicione outros componentes de upload conforme necessário
            default:
                return null;
        }
    };

    return (
        <Box >
            <Stepper variant="elevation" activeStep={activeStep} alternativeLabel>
                {steps.map((label, index) => (
                    <Step key={index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            <Box mt={3} height={"65vh"}>
                {renderUploadComponent(activeStep)}
            </Box>

            <Box mt={2}  display={"flex"} justifyContent={"flex-end"}>
                <Button disabled={activeStep === 0} onClick={handleBack}>
                    Voltar
                </Button>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleNext} 
                    disabled={activeStep === steps.length - 1}
                >
                    {activeStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                </Button>
            </Box>
        </Box>
    );
};

export default UploadStepper;
