import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ContentPaste,
  CloudUpload,
  ExpandMore,
  CheckCircle,
  Error
} from '@mui/icons-material';

const DataInput = ({ onDataLoad }) => {
  const [inputData, setInputData] = useState({
    players: '',
    squads: '',
    flags: '',
    vehicles: ''
  });

  const [processedData, setProcessedData] = useState({
    players: false,
    squads: false,
    flags: false,
    vehicles: false
  });

  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  // Парсеры для каждого типа данных
  const parsePlayersData = (text) => {
    const players = [];
    const lines = text.split('\n');
    let currentPlayer = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Номер и имя игрока
      const playerMatch = line.match(/^\s*(\d+)\.\s*(.+)/);
      if (playerMatch) {
        if (currentPlayer) {
          players.push(currentPlayer);
        }
        currentPlayer = {
          id: parseInt(playerMatch[1]),
          name: playerMatch[2],
          steam: '',
          steamId: '',
          fame: 0,
          accountBalance: 0,
          goldBalance: 0,
          location: { x: 0, y: 0, z: 0 }
        };
        continue;
      }

      if (!currentPlayer) continue;

      // Steam информация
      const steamMatch = line.match(/Steam:\s*(.+?)\s*\((\d+)\)/);
      if (steamMatch) {
        currentPlayer.steam = steamMatch[1];
        currentPlayer.steamId = steamMatch[2];
        continue;
      }

      // Fame
      const fameMatch = line.match(/Fame:\s*(\d+)/);
      if (fameMatch) {
        currentPlayer.fame = parseInt(fameMatch[1]);
        continue;
      }

      // Account balance
      const balanceMatch = line.match(/Account balance:\s*(-?\d+)/);
      if (balanceMatch) {
        currentPlayer.accountBalance = parseInt(balanceMatch[1]);
        continue;
      }

      // Gold balance
      const goldMatch = line.match(/Gold balance:\s*(\d+)/);
      if (goldMatch) {
        currentPlayer.goldBalance = parseInt(goldMatch[1]);
        continue;
      }

      // Location
      const locationMatch = line.match(/Location:\s*X=([-\d.]+)\s*Y=([-\d.]+)\s*Z=([-\d.]+)/);
      if (locationMatch) {
        currentPlayer.location = {
          x: parseFloat(locationMatch[1]),
          y: parseFloat(locationMatch[2]),
          z: parseFloat(locationMatch[3])
        };
      }
    }

    if (currentPlayer) {
      players.push(currentPlayer);
    }

    return players;
  };

  const parseSquadsData = (text) => {
    const squads = [];
    const lines = text.split('\n');
    let currentSquad = null;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Начало отряда
      const squadMatch = line.match(/\[SquadId:\s*(\d+)\s*SquadName:\s*(.+?)\s*\]/);
      if (squadMatch) {
        if (currentSquad) {
          squads.push(currentSquad);
        }
        currentSquad = {
          id: parseInt(squadMatch[1]),
          name: squadMatch[2].trim(),
          members: []
        };
        continue;
      }

      if (!currentSquad) continue;

      // Участник отряда
      const memberMatch = line.match(/SteamId:\s*(\d+)\s*SteamName:\s*(.+?)\s*CharacterName:\s*(.+?)\s*MemberRank:\s*(\d+)/);
      if (memberMatch) {
        currentSquad.members.push({
          steamId: memberMatch[1],
          steamName: memberMatch[2],
          characterName: memberMatch[3],
          rank: parseInt(memberMatch[4])
        });
      }
    }

    if (currentSquad) {
      squads.push(currentSquad);
    }

    return squads;
  };

  const parseFlagsData = (text) => {
    const flags = [];
    const lines = text.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line || line.includes('Page ') || line.includes('Flag ID:') === false) continue;

      const flagMatch = line.match(/Flag ID:\s*(\d+)\s*\|\s*Owner:\s*\[(\d+)\]\s*(.+?)\s*\((\d+)\)\s*\|\s*Location:\s*X=([-\d.]+)\s*Y=([-\d.]+)\s*Z=([-\d.]+)/);
      if (flagMatch) {
        flags.push({
          id: parseInt(flagMatch[1]),
          ownerSteamId: flagMatch[2],
          ownerName: flagMatch[3],
          ownerId: parseInt(flagMatch[4]),
          location: {
            x: parseFloat(flagMatch[5]),
            y: parseFloat(flagMatch[6]),
            z: parseFloat(flagMatch[7])
          }
        });
      }
    }

    return flags;
  };

  const parseVehiclesData = (text) => {
    const vehicles = [];
    const lines = text.split('\n');

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      const vehicleMatch = line.match(/#(\d+):\s*(.+?)\s+(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)\s+X=([-\d.]+)\s*Y=([-\d.]+)\s*Z=([-\d.]+)\s+(\d+|\d+\s+\d+|0)\s+(.*)/);
      if (vehicleMatch) {
        const ownerInfo = vehicleMatch[7];
        let ownerSteamId = null;
        
        if (ownerInfo !== 'No owner') {
          const ownerMatch = ownerInfo.match(/(\d+)/);
          if (ownerMatch) {
            ownerSteamId = ownerMatch[1];
          }
        }

        vehicles.push({
          id: parseInt(vehicleMatch[1]),
          type: vehicleMatch[2],
          spawnTime: vehicleMatch[3],
          location: {
            x: parseFloat(vehicleMatch[4]),
            y: parseFloat(vehicleMatch[5]),
            z: parseFloat(vehicleMatch[6])
          },
          ownerSteamId,
          ownerInfo: ownerInfo
        });
      }
    }

    return vehicles;
  };

  const processData = (type, text) => {
    if (!text.trim()) return;

    try {
      let parsedData = [];
      
      switch (type) {
        case 'players':
          parsedData = parsePlayersData(text);
          break;
        case 'squads':
          parsedData = parseSquadsData(text);
          break;
        case 'flags':
          parsedData = parseFlagsData(text);
          break;
        case 'vehicles':
          parsedData = parseVehiclesData(text);
          break;
      }

      onDataLoad(type, parsedData);
      setProcessedData(prev => ({ ...prev, [type]: true }));
      setNotification({
        open: true,
        message: `${getTypeLabel(type)}: обработано ${parsedData.length} записей`,
        severity: 'success'
      });
    } catch (error) {
      setNotification({
        open: true,
        message: `Ошибка обработки ${getTypeLabel(type).toLowerCase()}: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      players: 'Игроки',
      squads: 'Отряды',
      flags: 'Флаги',
      vehicles: 'Транспорт'
    };
    return labels[type];
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setInputData(prev => ({ ...prev, [type]: text }));
      processData(type, text);
    };
    reader.readAsText(file);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        <ContentPaste sx={{ mr: 1, verticalAlign: 'middle' }} />
        Загрузить данные SCUM сервера
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Основной способ:</strong> Скопируйте дампы admin командами в SCUM и вставьте в поля ниже (Ctrl+V)
      </Alert>

      <Grid container spacing={3}>
        {/* Игроки */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Chip 
                icon={processedData.players ? <CheckCircle /> : <ContentPaste />}
                label="Игроки (ListPlayers)"
                color={processedData.players ? 'success' : 'default'}
                sx={{ mb: 1 }}
              />
            </Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              placeholder="Вставьте данные игроков сюда..."
              value={inputData.players}
              onChange={(e) => setInputData(prev => ({ ...prev, players: e.target.value }))}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => processData('players', inputData.players)}
                disabled={!inputData.players.trim()}
              >
                Обработать
              </Button>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
              >
                Или загрузить файл
                <input
                  type="file"
                  hidden
                  accept=".txt"
                  onChange={(e) => handleFileUpload('players', e)}
                />
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Отряды */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Chip 
                icon={processedData.squads ? <CheckCircle /> : <ContentPaste />}
                label="Отряды (DumpAllSquadsInfoList)"
                color={processedData.squads ? 'success' : 'default'}
                sx={{ mb: 1 }}
              />
            </Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              placeholder="Вставьте данные отрядов сюда..."
              value={inputData.squads}
              onChange={(e) => setInputData(prev => ({ ...prev, squads: e.target.value }))}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => processData('squads', inputData.squads)}
                disabled={!inputData.squads.trim()}
              >
                Обработать
              </Button>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
              >
                Или загрузить файл
                <input
                  type="file"
                  hidden
                  accept=".txt"
                  onChange={(e) => handleFileUpload('squads', e)}
                />
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Флаги */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Chip 
                icon={processedData.flags ? <CheckCircle /> : <ContentPaste />}
                label="Флаги (ListFlags)"
                color={processedData.flags ? 'success' : 'default'}
                sx={{ mb: 1 }}
              />
            </Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              placeholder="Вставьте данные флагов сюда..."
              value={inputData.flags}
              onChange={(e) => setInputData(prev => ({ ...prev, flags: e.target.value }))}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => processData('flags', inputData.flags)}
                disabled={!inputData.flags.trim()}
              >
                Обработать
              </Button>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
              >
                Или загрузить файл
                <input
                  type="file"
                  hidden
                  accept=".txt"
                  onChange={(e) => handleFileUpload('flags', e)}
                />
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Транспорт */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Chip 
                icon={processedData.vehicles ? <CheckCircle /> : <ContentPaste />}
                label="Транспорт (ListSpawnedVehicles)"
                color={processedData.vehicles ? 'success' : 'default'}
                sx={{ mb: 1 }}
              />
            </Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              placeholder="Вставьте данные транспорта сюда..."
              value={inputData.vehicles}
              onChange={(e) => setInputData(prev => ({ ...prev, vehicles: e.target.value }))}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => processData('vehicles', inputData.vehicles)}
                disabled={!inputData.vehicles.trim()}
              >
                Обработать
              </Button>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
              >
                Или загрузить файл
                <input
                  type="file"
                  hidden
                  accept=".txt"
                  onChange={(e) => handleFileUpload('vehicles', e)}
                />
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default DataInput; 