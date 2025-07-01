import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tab,
  Tabs,
  Paper,
  CssBaseline
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  GridView as GridViewIcon,
  Language as LanguageIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Flag as FlagIcon,
  DirectionsCar as VehicleIcon
} from '@mui/icons-material';
import DataInput from './components/DataInput';
import PlayersView from './components/PlayersView';
import SquadsView from './components/SquadsView';
import FlagsView from './components/FlagsView';
import VehiclesView from './components/VehiclesView';
import './i18n';

// Создаем темную тему
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e676',
    },
    secondary: {
      main: '#ff5722',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);
  const [data, setData] = useState({
    players: [],
    squads: [],
    flags: [],
    vehicles: []
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLang);
  };

  const handleDataProcessed = (processedData) => {
    setData(processedData);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" color="transparent">
          <Toolbar>
            <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
              <GridViewIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {t('title')}
            </Typography>
            <IconButton color="inherit" onClick={handleLanguageChange}>
              <LanguageIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Paper sx={{ mb: 4 }}>
            <DataInput onDataProcessed={handleDataProcessed} />
          </Paper>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="inherit"
              sx={{
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <Tab icon={<PersonIcon />} label={t('playersView.title')} />
              <Tab icon={<GroupIcon />} label={t('squadsView.title')} />
              <Tab icon={<FlagIcon />} label={t('flagsView.title')} />
              <Tab icon={<VehicleIcon />} label={t('vehiclesView.title')} />
            </Tabs>
          </Box>

          <Box sx={{ mt: 2 }}>
            {currentTab === 0 && <PlayersView players={data.players} squads={data.squads} flags={data.flags} vehicles={data.vehicles} />}
            {currentTab === 1 && <SquadsView squads={data.squads} />}
            {currentTab === 2 && <FlagsView flags={data.flags} players={data.players} squads={data.squads} />}
            {currentTab === 3 && <VehiclesView vehicles={data.vehicles} players={data.players} />}
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
