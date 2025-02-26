import React, { useState } from 'react';
import { Box, Button, Drawer, List, Typography } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { KeyboardDoubleArrowLeft, KeyboardDoubleArrowRight, LocalAtm } from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Ícone para expandir
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // Ícone para recolher

interface SidebarProps {
  selectedOption: number;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedOption, setSelectedOption }) => {
  const [isCollapsed, setIsCollapsed] = useState(false); // Estado para controlar se a sidebar está recolhida

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: isCollapsed ? 80 : 200,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? 80 : 200,
          boxSizing: 'border-box',
        },
      }}
    >
      <Button
        onClick={toggleSidebar}
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          justifyContent: "center",
          alignSelf: 'center',
        }}
        startIcon={isCollapsed ? <KeyboardDoubleArrowRight /> : <KeyboardDoubleArrowLeft />}
        fullWidth
      >
      </Button>
      {!isCollapsed && <Box height={110} borderBottom={"1px solid white"} bgcolor={"#004792"}>
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
      </Box>}
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
              startIcon={isCollapsed ? <HealthAndSafetyIcon sx={{ color: 'white' }} /> : null}
              sx={{
                bgcolor: selectedOption === 0 ? "#1976d2" : "",
                justifyContent: isCollapsed ? "center" : "flex-start",
                width: '100%',
              }}
            >
              {!isCollapsed && (
                <Box display={"flex"}>
                  <HealthAndSafetyIcon sx={{ color: 'white' }} />
                  <Typography ml={1} fontSize={18} color="white" textAlign="start">
                    REGULAÇÃO
                  </Typography>
                </Box>
              )}
            </Button>

            <Button
              onClick={() => setSelectedOption(1)}
              startIcon={isCollapsed ? <LocalAtm sx={{ color: 'white' }} /> : null}
              sx={{
                bgcolor: selectedOption === 1 ? "#1976d2" : "",
                justifyContent: isCollapsed ? "center" : "flex-start",
                width: '100%',
              }}
            >
              {!isCollapsed && (
                <Box display={"flex"}>
                  <LocalAtm sx={{ color: 'white' }} />
                  <Typography ml={1} fontSize={18} color="white" textAlign="start">
                    Financeiro
                  </Typography>
                </Box>

              )}
            </Button>
          </List>
        </Box>

        {!isCollapsed && <Box display={"flex"} justifyContent={"center"} color={'white'} alignItems={"center"} flexDirection={"column"} pt={1} borderTop={"1px solid white"}>
          <Typography>desenvolvido por</Typography>
          <Typography fontSize={18} textTransform={"uppercase"}>Inovação & Melhoria</Typography>
        </Box>}


      </Box>
    </Drawer >
  );
};

export default Sidebar;
