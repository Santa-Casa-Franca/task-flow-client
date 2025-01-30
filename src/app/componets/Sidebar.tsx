import React from 'react';
import { Box, Button, Drawer, List, Typography } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { LocalAtm } from '@mui/icons-material';

interface SidebarProps {
  selectedOption: number;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedOption, setSelectedOption }) => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box height={110} borderBottom={"1px solid white"} bgcolor={"#004792"}>
        <Box
          component="img"
          sx={{
            height: 'auto', 
            width: '100%',  
            maxHeight: 233, 
            maxWidth: 350,  
            objectFit: 'contain', 
            mt: 1,
            p: 1
          }}
          alt="The house from the offer."
          src="img/Grupo Santa Casa horizontal PNG.png"
        />
      </Box>
      <Box bgcolor={"#004792"} height={"100vh"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
        <Box color="white">
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Button
              onClick={() => setSelectedOption(0)}
              startIcon={
                <HealthAndSafetyIcon
                  sx={{
                    color: 'white',
                    marginRight: 0,
                  }}
                />
              }
              sx={{
                bgcolor: selectedOption === 0 ? "#1976d2" : "",
                justifyContent: 'flex-start',
                m: 1,
              }}
            >
              <Typography fontSize={18} color="white" textAlign="start">
                REGULAÇÃO
              </Typography>
            </Button>

            <Button
              onClick={() => setSelectedOption(1)}
              startIcon={
                <LocalAtm
                  sx={{
                    color: 'white',
                  }}
                />
              }
              sx={{
                bgcolor: selectedOption === 1 ? "#1976d2" : "",
                justifyContent: 'flex-start',
                m: 1
              }}
            >
              <Typography fontSize={18} color="white" textAlign="start">
                Financeiro
              </Typography>
            </Button>
          </List>
        </Box>

        <Box display={"flex"} justifyContent={"center"} color={'white'} alignItems={"center"} flexDirection={"column"} pt={1} borderTop={"1px solid white"}>
          <Typography>desenvolvido por</Typography>
          <Typography fontSize={18} textTransform={"uppercase"}>Inovação & Melhoria</Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
