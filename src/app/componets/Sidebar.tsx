import React from 'react';
import { Box, Drawer, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';

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
      <Box bgcolor={"#004cff"} height={"100vh"} display={"flex"} flexDirection={"column"} justifyContent={"space-between"}>
        <Box color={"white"}>
          <List >
            <ListItemButton
              selected={selectedOption === 0}
              onClick={() => setSelectedOption(0)}
            >
              <HealthAndSafetyIcon />
              <ListItemText primary="REGULAÇÃO" />
            </ListItemButton>
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
