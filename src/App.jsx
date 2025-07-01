import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
  Chip,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  People,
  Groups,
  Flag,
  DirectionsCar,
  Dashboard
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import PlayersView from './components/PlayersView';
import SquadsView from './components/SquadsView';
import FlagsView from './components/FlagsView';
import VehiclesView from './components/VehiclesView';
import DataInput from './components/DataInput';

// Тёмная тема для красивого вида
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

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [gameData, setGameData] = useState({
    players: [],
    squads: [],
    flags: [],
    vehicles: []
  });
  const [loading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState({
    players: false,
    squads: false,
    flags: false,
    vehicles: false
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const getUploadStatus = () => {
    const uploaded = Object.values(uploadedFiles).filter(Boolean).length;
    return `${uploaded}/4`;
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Dashboard sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ScumDB - База данных SCUM
          </Typography>
          <Chip 
            label={`Файлов загружено: ${getUploadStatus()}`} 
            color="primary" 
            variant="outlined"
          />
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl">
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        
        {/* Ввод данных */}
        <DataInput 
          onDataLoad={(type, data) => {
            setGameData(prev => ({ ...prev, [type]: data }));
            setUploadedFiles(prev => ({ ...prev, [type]: true }));
          }}
        />

        {/* Статистика */}
        {Object.values(uploadedFiles).some(Boolean) && (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    <People sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Игроки
                  </Typography>
                  <Typography variant="h4">
                    {gameData.players.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Отряды
                  </Typography>
                  <Typography variant="h4">
                    {gameData.squads.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    <Flag sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Флаги
                  </Typography>
                  <Typography variant="h4">
                    {gameData.flags.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    <DirectionsCar sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Транспорт
                  </Typography>
                  <Typography variant="h4">
                    {gameData.vehicles.length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Основной интерфейс с вкладками */}
        {gameData.players.length > 0 && (
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              aria-label="game data tabs"
              variant="fullWidth"
            >
              <Tab 
                label="Игроки" 
                icon={<People />} 
                iconPosition="start"
              />
              <Tab 
                label="Отряды" 
                icon={<Groups />} 
                iconPosition="start"
              />
              <Tab 
                label="Флаги" 
                icon={<Flag />} 
                iconPosition="start"
              />
              <Tab 
                label="Транспорт" 
                icon={<DirectionsCar />} 
                iconPosition="start"
              />
            </Tabs>

            <TabPanel value={currentTab} index={0}>
              <PlayersView 
                players={gameData.players} 
                squads={gameData.squads}
                flags={gameData.flags}
                vehicles={gameData.vehicles}
              />
            </TabPanel>

            <TabPanel value={currentTab} index={1}>
              <SquadsView 
                squads={gameData.squads} 
                players={gameData.players}
              />
            </TabPanel>

            <TabPanel value={currentTab} index={2}>
              <FlagsView 
                flags={gameData.flags} 
                players={gameData.players}
              />
            </TabPanel>

            <TabPanel value={currentTab} index={3}>
              <VehiclesView 
                vehicles={gameData.vehicles} 
                players={gameData.players}
              />
            </TabPanel>
          </Paper>
        )}

        {Object.values(uploadedFiles).every(v => !v) && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Загрузите файлы дампов для начала анализа данных
          </Alert>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
